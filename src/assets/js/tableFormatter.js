import selectOptions from '@/assets/js/option'
export function formatform(row, selectItem, rowItem) {
    //selelctItem是option.js里的数组名，rowITem是row里的参数名
    let newItem = "";
    selectOptions[selectItem].forEach(item => {
      if (item.value === row[rowItem]) {
        newItem = item.label;
      }
    });
    return newItem;
  }

 export function formatArr(row,selectItem, rowItem) { 
    if (row[rowItem]) {
        let selectArr=selectOptions[selectItem];
        let newarr = row[rowItem].map(item => {  //newarr接受map的返回值
          for (let i = 0; i < selectArr.length; i++) {
            if (item == selectArr[i].value) {
              return selectArr[i].label;
            }
          }
        });
        return newarr.join(",");
      }
  }