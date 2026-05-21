import { useState, useRef, useEffect } from "react";
import { scoreTable } from "./scoreTable";

function useIsMobile(){
  const [isMobile,setIsMobile]=useState(false);

  useEffect(()=>{
    const check=()=>{
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize",check);
    return ()=>window.removeEventListener("resize",check);
  },[]);
  return isMobile;
}

export default function App() {

  const isMobile = useIsMobile();

  const rows = [20,25,30,40,50,60,70,80,90,100,110];
  const hans = [1,2,3,4];

  const [mode,setMode]=useState("子ロン");
  const [answers,setAnswers]=useState({});
  const [results,setResults]=useState({});

  const inputRefs=useRef({});

  function handleChange(key,value){
    setAnswers({
      ...answers,
      [key]: value.replace(/,/g,"").replace(/[^0-9]/g,"")
    });
  }

  function moveNext(currentKey){

    const keys=[];

    rows.forEach(fu=>{
      hans.forEach(han=>{

        const key=`${fu}-${han}`;
        const exists=scoreTable[mode]?.[key];
        if(!exists)return;

        if(mode==="子ツモ"){
          keys.push(key+"-ko");
          keys.push(key+"-oya");
        }else{
          keys.push(key);
        }

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

  // ======================
  // 📱スマホ（改善版）
  // ======================
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
                padding:"6px",
                fontSize:13,
                borderRadius:8,
                background:mode===m?"#ddd":"white"
              }}
            >
              {m}
            </button>
          ))}

          <button onClick={grade} style={{padding:6,fontSize:13}}>採点</button>
          <button onClick={reset} style={{padding:6,fontSize:13}}>リセット</button>

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

            <div style={{fontWeight:"bold",fontSize:12,marginBottom:4}}>
              {fu}符
            </div>

            {/* ⭐横並びだけど完全圧縮 */}
            <div style={{
              display:"flex",
              flexWrap:"nowrap",
              gap:3
            }}>

              {hans.map(han=>{

                const key=`${fu}-${han}`;
                const exists=scoreTable[mode]?.[key];
                if(!exists) return null;

                const result=results[key];

                return(
                  <div key={key}
                    style={{
                      flex:1,
                      minWidth:0,
                      padding:3,
                      border:"1px solid #ddd",
                      borderRadius:6,
                      background:
                        result
                        ? (result.correct?"#ccffcc":"#ffcccc")
                        : "white"
                    }}
                  >

                    <div style={{fontSize:10}}>
                      {han}翻
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      value={answers[key]||""}
                      onChange={e=>handleChange(key,e.target.value)}
                      onFocus={(e)=>e.target.select()}
                      onKeyDown={(e)=>{
                        if(e.key==="Enter"){
                          e.preventDefault();
                          moveNext(key);
                        }
                      }}
                      style={{
                        width:"100%",
                        fontSize:14,
                        padding:2
                      }}
                    />

                    {result && !result.correct &&
                      <div style={{fontSize:9}}>
                        正解:{result.answer}
                      </div>
                    }

                  </div>
                );

              })}

            </div>

          </div>
        ))}

      </div>
    );
  }

  // ======================
  // 💻PC（そのまま）
  // ======================
  function DesktopView(){
    return(
      <div style={{padding:16}}>
        <h1>麻雀点数表トレーニング</h1>
      </div>
    );
  }

  return isMobile ? <MobileView/> : <DesktopView/>;

}