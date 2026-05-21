import {
  calcScore
  }
  from "./scoreCalculator";
  
  const rows=[
  20,25,30,40,
  50,60,70,
  80,90,100,
  110
  ];
  
  const hans=[
  1,2,3,4
  ];
  
  export const scoreTable={
  
  "子ロン":{},
  "親ロン":{},
  "子ツモ":{},
  "親ツモ":{}
  
  };
  
  rows.forEach((fu)=>{
  
  hans.forEach((han)=>{
  
  const key=
  `${fu}-${han}`;
  
  
  //子ロン
  let r=
  
  calcScore(
  fu,
  han,
  false,
  false
  );
  
  if(r){
  
  scoreTable[
  "子ロン"
  ][key]=
  String(r);
  
  }
  
  
  //親ロン
  
  r=
  calcScore(
  fu,
  han,
  true,
  false
  );
  
  if(r){
  
  scoreTable[
  "親ロン"
  ][key]=
  String(r);
  
  }
  
  
  //子ツモ
  
  r=
  calcScore(
  fu,
  han,
  false,
  true
  );
  
  if(r){
  
  scoreTable[
  "子ツモ"
  ][key]={
  
  ko:
  String(r.ko),
  
  oya:
  String(
  r.oya
  )
  
  };
  
  }
  
  
  //親ツモ
  
  r=
  calcScore(
  fu,
  han,
  true,
  true
  );
  
  if(r){
  
  scoreTable[
  "親ツモ"
  ][key]=
  
  `${r.all}オール`;
  
  }
  
  });
  
  });