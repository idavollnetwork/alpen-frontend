import xlwt
import json

def generate_dict(input_file):
    res = {}
    with open(input_file,'r') as f:
        text = f.read()
        obj = json.loads(text)
        for key in obj.keys():
            if type(obj[key]) == dict:
                for aKey in obj[key].keys():
                    if type(obj[key][aKey]) == dict:
                        for bKey in obj[key][aKey].keys():
                            res['{}:{}:{}'.format(key, aKey, bKey)] = obj[key][aKey][bKey]
                    else:
                        res['{}:{}'.format(key, aKey)] = obj[key][aKey]
            else:
                res[key] = obj[key]
    return res

cn_file = './src/locales/zh_CN.json'
en_file = './src/locales/en_US.json'
kr_file = './src/locales/ko_KR.json'

cn_dict = generate_dict(cn_file)
en_dict = generate_dict(en_file)
kr_dict = generate_dict(kr_file)

wb = xlwt.Workbook()
ws = wb.add_sheet('translate')

current_index = 1
ws.write(0, 0, '名称')
ws.write(0, 1, '中文')
ws.write(0, 2, '英文')
ws.write(0, 3, '韩文')

for key in en_dict.keys():
    ws.write(current_index, 0, key)
#     ws.write(current_index, 1, cn_dict[key])
    ws.write(current_index, 2, en_dict[key])
    ws.write(current_index, 3, kr_dict[key])
    current_index += 1

wb.save('translate.xls')
