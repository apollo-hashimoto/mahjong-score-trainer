import { useState, useRef } from "react";
import { scoreTable } from "./scoreTable";

export default function App() {

  const rows=[20,25,30,40,50,60,70,80,90,100,110];
  const hans=[1,2,3,4];

  const [mode,setMode]=useState("子ロン");
  const [answers,setAnswers]=useState({});
  const [results,setResults]=useState({});

  const inputRefs=useRef({});

  function handleChange(key,value){
    setAnswers(prev=>({
      ...prev,
      [key]: value.replace(/[^0-9]/g,"")
    }));
  }

  function moveNext(currentKey){

    const keys=[];

    rows.forEach(fu=>{
      hans.forEach(han=>{
        const key=`${fu}-${han}`;
        const exists=scoreTable[mode]?.[key];
        if(!exists)return;
        keys.push(key);
      });
    });

    const i=keys.indexOf(currentKey);
    const next=keys[i+1];

    if(next && inputRefs.current[next]){
      inputRefs.current[next].focus();
    }
  }

  function grade(){

    const newResults={};

    rows.forEach(fu=>{
      hans.forEach(han=>{

        const key=`${fu}-${han}`;
        const answer=scoreTable[mode]?.[key];
        if(!answer)return;

        if(mode==="子ツモ"){

          const ko=answers[key+"-ko"]||"";
          const oya=answers[key+"-oya"]||"";

          newResults[key]={
            correct:ko===answer.ko && oya===answer.oya,
            answer:`${answer.ko}/${answer.oya}`
          };

        }else{

          const user=answers[key]||"";

          const correct =
            mode==="親ツモ"
              ? answer.replace("オール","")
              : answer;

          newResults[key]={
            correct:user===correct,
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

  // =========================
  // 📱スマホ（安定版）
  // =========================
  function MobileView(){

    return(
      <div style={{padding:10}}>

        <h2>麻雀点数表</h2>

        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>

          {["子ロン","子ツモ","親ロン","親ツモ"].map(m=>(
            <button
              key={m}
              onClick={()=>{
                setMode(m);
                reset();
              }}
              style={{
                padding:6,
                fontSize:13,
                borderRadius:8,
                background:mode===m?"#ddd":"white"
              }}
            >
              {m}
            </button>
          ))}

          <button onClick={grade}>採点</button>
          <button onClick={reset}>リセット</button>

        </div>

        {rows.map(fu=>(
          <div key={fu}
            style={{
              border:"1px solid #ccc",
              padding:6,
              marginBottom:8,
              borderRadius:8
            }}
          >

            <div style={{fontWeight:"bold",fontSize:12}}>
              {fu}符
            </div>

            <div style={{display:"flex",gap:4}}>

              {hans.map(han=>{

                const key=`${fu}-${han}`;
                const exists=scoreTable[mode]?.[key];
                if(!exists) return null;

                const result=results[key];

                return(
                  <div key={key}
                    style={{
                      flex:1,
                      border:"1px solid #ddd",
                      borderRadius:6,

                      /* ⭐高さ固定（崩れ防止） */
                      minHeight:78,

                      background:result
                        ? (result.correct?"#ccffcc":"#ffcccc")
                        : "white"
                    }}
                  >

                    <div style={{
                      fontSize:10,
                      textAlign:"center",
                      height:16
                    }}>
                      {han}翻
                    </div>

                    <div style={{
                      height:34,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center"
                    }}>

                      <input
                        ref={el=>inputRefs.current[key]=el}
                        value={answers[key] ?? ""}
                        onChange={e=>handleChange(key,e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==="Enter"){
                            e.preventDefault();
                            moveNext(key);
                          }
                        }}
                        style={{
                          width:"90%",
                          fontSize:14,
                          textAlign:"center"
                        }}
                      />

                    </div>

                    {/* ⭐最初から高さ確保（後から出しても崩れない） */}
                    <div style={{
                      fontSize:9,
                      textAlign:"center",
                      height:16
                    }}>
                      {result && !result.correct
                        ? `正解:${result.answer}`
                        : " "}
                    </div>

                  </div>
                );

              })}

            </div>

          </div>
        ))}

      </div>
    );
  }

  // =========================
  // 💻PC（大きめ＆安定）
  // =========================
  function DesktopView(){

    return(
      <div style={{
        padding:24,
        maxWidth:1400,
        margin:"0 auto",
        fontSize:18
      }}>

        <h1 style={{fontSize:28}}>
          麻雀点数表トレーニング
        </h1>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>

          {["子ロン","子ツモ","親ロン","親ツモ"].map(m=>(
            <button
              key={m}
              onClick={()=>{
                setMode(m);
                reset();
              }}
              style={{
                padding:14,
                fontSize:18,
                borderRadius:10,
                background:mode===m?"#ddd":"white"
              }}
            >
              {m}
            </button>
          ))}

          <button onClick={grade} style={{padding:14,fontSize:18}}>
            採点
          </button>

          <button onClick={reset} style={{padding:14,fontSize:18}}>
            リセット
          </button>

        </div>

        <table style={{
          fontSize:18,
          borderCollapse:"collapse",
          width:"100%"
        }}>

          <thead>
            <tr>
              <th>符/翻</th>
              {hans.map(h=><th key={h}>{h}翻</th>)}
            </tr>
          </thead>

          <tbody>

            {rows.map(fu=>(
              <tr key={fu}>
                <td style={{padding:10}}>{fu}符</td>

                {hans.map(han=>{

                  const key=`${fu}-${han}`;
                  const exists=scoreTable[mode]?.[key];
                  const result=results[key];

                  let bg="white";
                  if(!exists) bg="#eee";
                  else if(result) bg=result.correct?"#ccffcc":"#ffcccc";

                  return(
                    <td key={key}
                      style={{
                        border:"1px solid #ccc",
                        padding:10,
                        background:bg,
                        minWidth:110,
                        height:90   /* ⭐高さ固定 */
                      }}
                    >
                      {exists ? (
                        <input
                          ref={el=>inputRefs.current[key]=el}
                          value={answers[key] ?? ""}
                          onChange={e=>handleChange(key,e.target.value)}
                          style={{
                            width:80,
                            fontSize:18,
                            textAlign:"center"
                          }}
                        />
                      ) : "---"}

                      <div style={{
                        fontSize:12,
                        minHeight:16,
                        marginTop:6
                      }}>
                        {result && !result.correct
                          ? `正解:${result.answer}`
                          : " "}
                      </div>

                    </td>
                  );

                })}

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    );
  }

  return <DesktopView />; // ←まず安定優先で固定（あとでスマホ切替戻す）

}