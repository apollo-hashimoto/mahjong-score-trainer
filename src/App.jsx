import { useState, useRef } from "react";
import { scoreTable } from "./scoreTable";

export default function App() {
  const rows = [20,25,30,40,50,60,70,80,90,100,110];
  const hans = [1,2,3,4];

  const [mode,setMode]=useState("子ロン");
  const [answers,setAnswers]=useState({});
  const [results,setResults]=useState({});

  const inputRefs=useRef({});

  function handleChange(key,value){

    setAnswers({

      ...answers,

      [key]:
      value
      .replace(/,/g,"")
      .replace(/[^0-9]/g,"")

    });

  }

  function moveNext(currentKey){

    const keys=[];

    rows.forEach((fu)=>{

      hans.forEach((han)=>{

        const key=`${fu}-${han}`;

        const exists=
        scoreTable[mode]?.[key];

        if(!exists)return;

        if(mode==="子ツモ"){

          keys.push(key+"-ko");
          keys.push(key+"-oya");

        }else{

          keys.push(key);

        }

      });

    });

    const currentIndex=
    keys.indexOf(currentKey);

    const nextKey=
    keys[currentIndex+1];

    if(
      nextKey &&
      inputRefs.current[nextKey]
    ){

      inputRefs.current[nextKey]
      .focus();

    }

  }

  function grade(){

    const newResults={};

    rows.forEach((fu)=>{

      hans.forEach((han)=>{

        const key=`${fu}-${han}`;

        const answer=
        scoreTable[mode]?.[key];

        if(!answer)return;

        if(mode==="子ツモ"){

          const ko=
          answers[key+"-ko"]||"";

          const oya=
          answers[key+"-oya"]||"";

          newResults[key]={

            correct:

            ko===answer.ko
            &&
            oya===answer.oya,

            answer:
            `${answer.ko}/${answer.oya}`

          };

        }else{

          const user=
          answers[key]||"";

          const correct=

          mode==="親ツモ"

          ?

          answer.replace(
          "オール",
          ""
          )

          :

          answer;

          newResults[key]={

          correct:
          user===correct,

          answer:
          answer

          };

        }

      });

    });

    setResults(newResults);

  }

  function reset(){

    setAnswers({});
    setResults({});

  }

return(

<div
style={{
padding:12,
maxWidth:1200,
margin:"0 auto"
}}
>

<h1>
麻雀点数表トレーニング
</h1>

<div
style={{
fontSize:12,
marginBottom:10,
color:"#666"
}}
>

← 横スクロールできます →

</div>

<div
style={{
display:"flex",
gap:8,
flexWrap:"wrap",
marginBottom:15,
alignItems:"center"
}}
>

{[
"子ロン",
"子ツモ",
"親ロン",
"親ツモ"
]

.map((m)=>(

<button

key={m}

onClick={()=>{

setMode(m);
reset();

}}

style={{

padding:"12px",
fontSize:16,
borderRadius:8,

background:

mode===m

?

"#ddd"

:

"white"

}}

>

{m}

</button>

))}

<button
onClick={grade}
style={{
padding:"12px",
fontSize:16,
borderRadius:8
}}
>

採点

</button>

<button
onClick={reset}
style={{
padding:"12px",
fontSize:16,
borderRadius:8
}}
>

リセット

</button>

</div>

<div
style={{
overflowX:"auto",
paddingBottom:10,
paddingLeft:5,
paddingRight:5
}}
>

<table
style={{
fontSize:14,
borderCollapse:"collapse",
background:"white"
}}
>

<thead>

<tr>

<th
style={{
border:"1px solid #ccc"
}}
>
符/翻
</th>

{
hans.map(

(h)=>

<th

key={h}

style={{
border:"1px solid #ccc"
}}

>

{h}翻

</th>

)

}

</tr>

</thead>

<tbody>

{

rows.map((fu)=>(

<tr key={fu}>

<td
style={{
border:"1px solid #ccc"
}}
>
{fu}符
</td>

{

hans.map((han)=>{

const key=
`${fu}-${han}`;

const result=
results[key];

const exists=
scoreTable[mode]?.[key];

let bg="white";

if(!exists){

bg="#e5e5e5";

}

else if(result){

bg=

result.correct

?

"#ccffcc"

:

"#ffcccc";

}

return(

<td

key={key}

style={{

border:
"1px solid #ccc",

background:bg,

minWidth:90

}}

>

{

!exists

?

<div>---</div>

:

mode==="子ツモ"

?

<div>

<input

ref={(el)=>

inputRefs.current[
key+"-ko"
]=el

}

value={

answers[
key+"-ko"
]||""

}

placeholder="子"

onKeyDown={(e)=>{

if(
e.key==="Enter"
){

e.preventDefault();

moveNext(
key+"-ko"
)

}

}}

onChange={(e)=>

handleChange(

key+"-ko",

e.target.value

)

}

style={{
width:38,
fontSize:"16px"
}}
/>

<input

ref={(el)=>

inputRefs.current[
key+"-oya"
]=el

}

value={

answers[
key+"-oya"
]||""

}

placeholder="親"

onKeyDown={(e)=>{

if(
e.key==="Enter"
){

e.preventDefault();

moveNext(
key+"-oya"
)

}

}}

onChange={(e)=>

handleChange(

key+"-oya",

e.target.value

)

}

style={{
width:38,
marginLeft:4,
fontSize:"16px"
}}
/>

</div>

:

<input

ref={(el)=>

inputRefs.current[
key
]=el

}

value={
answers[key]
||""
}

onKeyDown={(e)=>{

if(
e.key==="Enter"
){

e.preventDefault();

moveNext(key)

}

}}

onChange={(e)=>

handleChange(

key,

e.target.value

)

}

style={{
width:55,
fontSize:"16px"
}}
/>

}

{

result &&

!result.correct

&&

<div
style={{
fontSize:11
}}
>

正解:
{
result.answer
}

</div>

}

</td>

)

})

}

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}