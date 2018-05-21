from bs4 import BeautifulSoup
import requests
import json
import re
import os

def find_all_schools(url, school_type):

    found = []

    schools_html = requests.get(url).text

    soup = BeautifulSoup(schools_html, 'html.parser')

    for school_card in soup.find_all('div', class_='h-card-school-index-item'):

        name = school_card.find('h4', class_='p-name').string.strip()
        short_name = name.lower().replace('-', '').replace(' ', '')
        website = school_card.find('a', class_='p-url')['href']

        print(name)

        school_css = requests.get(website + '/packages/cfisd_school/themes/cfisd_school/css/main.css').text

        color_a = re.search(r'#nav {[\s\S]+?background: (#\w+?);', school_css).group(1)

        color_b = re.search(r'#nav\.focus > \.menu-handle {[\s\S]+?background-color: (#\w+?);', school_css).group(1)

        color_c = re.search(r'#features {[\s\S]+?background: (#\w+?);', school_css).group(1)

        found.append({
            'name': name,
            'shortname': short_name,
            'website': website,
            'colorA': color_a,
            'colorB': color_b,
            'colorC': color_c,
            'schooltype': school_type
        })

    return found



schools = []
#schools.extend(find_all_schools('https://www.cfisd.net/en/schools-facilities/our-schools/elementary-schools/', 'elementary'))
#schools.extend(find_all_schools('https://www.cfisd.net/en/schools-facilities/our-schools/middle-schools/', 'middle'))
schools.extend(find_all_schools('https://www.cfisd.net/en/schools-facilities/our-schools/high-schools/', 'high'))

with open(os.path.join('src', 'app', 'schools.ts'), 'w') as ts_file:

    ts_file.write('export var Schools = ')
    ts_file.write(json.dumps(schools, indent=4))
    ts_file.write(';')
