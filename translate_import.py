import xlrd
import json


apath = './alpen_translate_1105(jake).xls'
book = xlrd.open_workbook(apath, encoding_override='utf-8')
ws = book.sheet_by_index(0)
en_res = {}
zh_res = {}
kr_res = {}


def add_to_dict(res, key, value):
    key_arr = key.split(':')
    print(key)
    if len(key_arr) == 1:
        res[key] = value
    elif len(key_arr) == 2:
        if key_arr[0] not in res:
            res[key_arr[0]] = {}
        res[key_arr[0]][key_arr[1]] = value
    elif len(key_arr) == 3:
        if key_arr[0] not in res:
            res[key_arr[0]] = {}
        if key_arr[1] not in res[key_arr[0]]:
            res[key_arr[0]][key_arr[1]] = {}
        res[key_arr[0]][key_arr[1]][key_arr[2]] = value


for rx in range(ws.nrows):
    if rx > 0:
        key = ws.cell(rx, 0).value
        en = ws.cell(rx, 2).value
        kr = ws.cell(rx, 3).value
        print(kr)
#         add_to_dict(zh_res, key, zh)
        add_to_dict(en_res, key, en)
        add_to_dict(kr_res, key, kr)


en_file = open('./en.json', 'w')
text = json.dumps(en_res)
en_file.write(text)

kr_file = open('./kr.json', 'w')
text = json.dumps(kr_res, ensure_ascii=False)
print(text)
kr_file.write(text)

# zh_file = open('./zh.json', 'w')
# text = json.dumps(zh_res, ensure_ascii=False)
# zh_file.write(text)

