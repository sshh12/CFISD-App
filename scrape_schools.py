from bs4 import BeautifulSoup
import requests
import json
import re
import os


# Parser

def find_all_schools(url, school_type):

    found = []
    colors = {}

    schools_html = requests.get(url).text

    soup = BeautifulSoup(schools_html, 'html.parser')

    for school_card in soup.find_all('div', class_='h-card-school-index-item'):

        name = school_card.find('h4', class_='p-name').string.strip()
        short_name = name.lower().replace('-', '').replace(' ', '')
        website = school_card.find('a', class_='p-url')['href']

        print(name)

        school_page = requests.get(website).text
        school_css = requests.get(website + '/packages/cfisd_school/themes/cfisd_school/css/main.css').text

        color_a = re.search(r'#nav {[\s\S]+?background: (#\w+?);', school_css).group(1)

        color_b = re.search(r'#nav\.focus > \.menu-handle {[\s\S]+?background-color: (#\w+?);', school_css).group(1)

        color_c = re.search(r'#features {[\s\S]+?background: (#\w+?);', school_css).group(1)

        faculty_url = re.search(r'<a href="(\S+)">Faculty Web Pages<', school_page).group(1).strip()
        if "campus_list_" not in faculty_url:
            faculty_url = re.search(r'<a href="(\S+)">Faculty Webpages', school_page).group(1).strip()

        bells_url = website + "/en/parents-students/schedules/bell-schedule/"
        basic_news_url = website + "/en/news/school-news/"

        found.append({
            'name': name,
            'shortname': short_name,
            'website': website,
            'faculty': faculty_url,
            'bells': bells_url,
            'basicnews': basic_news_url,
            'colorA': short_name + '-colorA',
            'colorB': short_name + '-colorB',
            'colorC': short_name + '-colorC',
            'schooltype': school_type
        })

        colors.update({
            short_name + '-colorA': color_a,
            short_name + '-colorB': color_b,
            short_name + '-colorC': color_c
        })

    return found, colors


# Color Utils

def hex_to_rgb(hex_):
    hex_ = hex_.replace("#", "")
    r = int(hex_[:2], 16)
    g = int(hex_[2:4], 16)
    b = int(hex_[4:6], 16)
    return r, g, b


def rgb_to_hex(r, g, b):
    convert = lambda i : hex(i)[2:].zfill(2)
    return f'#{convert(r)}{convert(r)}{convert(r)}'


def get_contrast(hex_):
    return "#ffffff"


def get_shade(hex_):
    r, g, b = hex_to_rgb(hex_)
    r2 = int(r * 0.9)
    g2 = int(g * 0.9)
    b2 = int(b * 0.9)
    return rgb_to_hex(r2, g2, b2)


def get_tint(hex_):
    r, g, b = hex_to_rgb(hex_)
    r2 = r + int((255 - r) * .1)
    g2 = g + int((255 - g) * .1)
    b2 = b + int((255 - b) * .1)
    return rgb_to_hex(r2, g2, b2)


if __name__ == "__main__":
    
    highschools, highschool_colors = find_all_schools('https://www.cfisd.net/en/schools-facilities/our-schools/high-schools/', 'high')

    schools = highschools

    colors = {
        **highschool_colors
    }

    with open('schools.ts', 'w') as ts_file:

        ts_file.write('export var Schools = ')
        ts_file.write(json.dumps(schools, indent=4))
        ts_file.write(';')

    with open('colors.scss', 'w') as scss_file:

        scss_file.write('  /** School Themes **/\n')

        for name, hex_ in colors.items():

            r, g, b = hex_to_rgb(hex_)
            
            scss_file.write(f'--ion-color-{name}: {hex_};\n')
            scss_file.write(f'--ion-color-{name}-rgb: {r}, {g}, {b};\n')

            contrast = get_contrast(hex_)
            cr, cg, cb = hex_to_rgb(contrast)

            scss_file.write(f'--ion-color-{name}-contrast: {contrast};\n')
            scss_file.write(f'--ion-color-{name}-contrast-rgb: {cr}, {cg}, {cb};\n')

            shade = get_shade(hex_)
            tint = get_tint(hex_)

            scss_file.write(f'--ion-color-{name}-shade: {shade};\n')
            scss_file.write(f'--ion-color-{name}-tint: {tint};\n')

        scss_file.write('\n'*3)

        for name, hex_ in colors.items():

            scss_file.write(f'.ion-color-{name} {{\n')
            scss_file.write(f'  --ion-color-base: var(--ion-color-{name}) !important;\n')
            scss_file.write(f'  --ion-color-base-rgb: var(--ion-color-{name}-rgb) !important;\n')
            scss_file.write(f'  --ion-color-contrast: var(--ion-color-{name}-contrast) !important;\n')
            scss_file.write(f'  --ion-color-contrast-rgb: var(--ion-color-{name}-contrast-rgb) !important;\n')
            scss_file.write(f'  --ion-color-shade: var(--ion-color-{name}-shade) !important;\n')
            scss_file.write(f'  --ion-color-tint: var(--ion-color-{name}-tint) !important;\n')
            scss_file.write('}\n')
