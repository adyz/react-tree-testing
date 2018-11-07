const flattenObject = function(obj: any) {
  const toReturn: any = {};

  function rec(obj: any, prevIndex: any) {
    for (var i in obj) {
      const { children, ...rest } = obj[i];
      const myKey = "0" + prevIndex ? prevIndex + "-" + i : i;
      if (children && children.length > 0) {
        toReturn[myKey] = {
          ...rest,
          path: myKey,
          children: true,
          parent: prevIndex,
          expanded: false,
          visible: true,
          state: 0
        };

        rec(children, myKey);
      } else {
        toReturn[myKey] = {
          ...rest,
          path: myKey,
          children: false,
          parent: prevIndex,
          expanded: false,
          visible: true,
          state: 0
        };
      }
    }
  }

  rec(obj, 0);

  console.log({ toReturn });

  return toReturn;
};

export default flattenObject;
