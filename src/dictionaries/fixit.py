import json
import re

with open("1828_dictionary.json", "r", encoding="utf-8") as f:
    data = json.load(f)

new_data = {}

pattern = re.compile(r'(\b\d+\.\s.*?)(?=(\b\d+\.\s)|$)', re.DOTALL)
obs_pattern = re.compile(r'\[Obs\.\].*$', re.DOTALL)

for word, definition in data.items():
    matches = pattern.findall(definition)
    
    if matches:
        defs = []
        prev_num = None
        for text, _ in matches:
            text = text.strip()
            text = obs_pattern.sub('', text).strip()
            
            # Extract leading number
            m = re.match(r'(\d+)\.', text)
            if m:
                num = int(m.group(1))
            else:
                num = 0
            
            # Merge if number jumps unusually, unless it's a restart at 1
            if prev_num and num != 1 and num <= prev_num:
                defs[-1] += ' ' + text  # merge into previous
            else:
                defs.append(text)
                prev_num = num
        new_data[word] = defs
    else:
        new_data[word] = [definition]

with open("1828_dictionary_split_clean.json", "w", encoding="utf-8") as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print("Done! Definitions split with smart merging for high numbers.")
