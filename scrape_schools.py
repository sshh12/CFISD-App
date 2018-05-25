from bs4 import BeautifulSoup
import requests
import json
import re
import os

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

        faculty_url = re.search(r'<a href="(\S+)">Faculty Web Pages', school_page).group(1).strip()
        bells_url = website + "/en/parents-students/schedules/bell-schedule/"

        found.append({
            'name': name,
            'shortname': short_name,
            'website': website,
            'faculty': faculty_url,
            'bells': bells_url,
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


highschools, highschool_colors = find_all_schools('https://www.cfisd.net/en/schools-facilities/our-schools/high-schools/', 'high')

schools = highschools

colors = {
    'primary': '#488aff',
    'secondary': '#32db64',
    'danger': '#f53d3d',
    'light': '#f4f4f4',
    'dark': '#222',
    'great': '#4CAF50',
    'ok': '#FFCA28',
    'poor': '#673AB7',
    'bad': '#E53935',
    'zero': '#424242',
    'none': '#757575',
    **highschool_colors
}

with open(os.path.join('src', 'app', 'schools.ts'), 'w') as ts_file:

    ts_file.write('export var Schools = ')
    ts_file.write(json.dumps(schools, indent=4))
    ts_file.write(';')

with open(os.path.join('src', 'theme', 'colors.scss'), 'w') as scss_file:

    scss_file.write('$colors: (\n')

    for name, hex_ in colors.items():

        scss_file.write('    ' + name + ': ' + hex_ + ',\n')

    scss_file.write(');')
