function ceil100(n){
  return Math.ceil(n/100)*100;
}

export function calcScore(
  fu,
  han,
  isParent,
  isTsumo
){

  //20符ロンなし
  if(
    fu===20 &&
    !isTsumo
  ){
    return null;
  }

  //20符1翻なし
  if(
    fu===20 &&
    han===1
  ){
    return null;
  }

  //25符1翻なし
  if(
    fu===25 &&
    han===1
  ){
    return null;
  }

  //七対子ツモ2翻なし
  if(
    fu===25 &&
    han===2 &&
    isTsumo
  ){
    return null;
  }

  let base=
    fu*Math.pow(
      2,
      han+2
    );

  if(
    han>=5 ||
    base>=2000
  ){
    base=2000;
  }

  if(isTsumo){

    if(isParent){

      return{
        all:
        ceil100(
          base*2
        )
      };

    }

    return{

      ko:
      ceil100(base),

      oya:
      ceil100(
        base*2
      )

    };

  }

  return ceil100(

    base*
    (
      isParent
      ?6
      :4
    )

  );

}