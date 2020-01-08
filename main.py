import json

from source.bin.vmf.parsers import VMFParser

if __name__ == '__main__':
   parser = VMFParser()
   parser.parse('dd')
   print('dd')
