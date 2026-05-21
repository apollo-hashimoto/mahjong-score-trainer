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

  // =========================
  // 📱 スマホ版（カードUI）
  // =========================
  function MobileView(){

    return(
      <div style={{padding:12}}>

        <h2>麻雀点数表</h2>

        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>

          {["子ロン","子ツモ","親ロン","親ツモ"].map(m=>(
            <button
              key={m}
              onClick={()=>{
                setMode(m);
                reset();
              }}
              style={{
                padding:"10px",
                fontSize:16,
                borderRadius:8,
                background:mode===m?"#ddd":"white"
              }}
            >
              {m}
            </button>
          ))}

          <button onClick={grade} style={{padding:10}}>採点</button>
          <button onClick={reset} style={{padding:10}}>リセット</button>

        </div>

        {rows.map(fu=>(
          <div key={fu}
            style={{
              border:"1px solid #ccc",
              padding:8,
              marginBottom:10,
              borderRadius:10
            }}
          >

            <div style={{fontWeight:"bold",marginBottom:6}}>
              {fu}符
            </div>

            {/* ⭐ここが修正ポイント（横1列固定） */}
            <div style={{
              display:"flex",
              flexWrap:"nowrap",
              gap:6,
              overflowX:"auto"
            }}>

              {hans.map(han=>{

                const key=`${fu}-${han}`;
                const exists=scoreTable[mode]?.[key];

                if(!exists) return null;

                const result=results[key];

                return(
                  <div key={key}
                    style={{
                      padding:6,
                      minWidth:70,
                      flex:"0 0 auto",
                      border:"1px solid #ddd",
                      borderRadius:8,
                      background:
                        result
                        ? (result.correct?"#ccffcc":"#ffcccc")
                        : "white"
                    }}
                  >

                    <div style={{fontSize:13}}>
                      {han}翻
                    </div>

                    <input
                      value={answers[key]||""}
                      onChange={e=>handleChange(key,e.target.value)}
                      onKeyDown={(e)=>{
                        if(e.key==="Enter"){
                          e.preventDefault();
                          moveNext(key);
                        }
                      }}
                      style={{
                        width:60,
                        fontSize:15
                      }}
                    />

                    {result && !result.correct &&
                      <div style={{fontSize:11}}>
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

  // =========================
  // 💻 PC版（表）
  // =========================
  function DesktopView(){

    return(
      <div style={{padding:16,maxWidth:1200,margin:"0 auto",fontSize:16}}>

        <h1>麻雀点数表トレーニング</h1>

        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:15}}>

          {["子ロン","子ツモ","親ロン","親ツモ"].map(m=>(
            <button
              key={m}
              onClick={()=>{
                setMode(m);
                reset();
              }}
              style={{
                padding:12,
                fontSize:16,
                borderRadius:8,
                background:mode===m?"#ddd":"white"
              }}
            >
              {m}
            </button>
          ))}

          <button onClick={grade} style={{padding:12}}>採点</button>
          <button onClick={reset} style={{padding:12}}>リセット</button>

        </div>

        <div style={{overflowX:"auto"}}>

          <table style={{fontSize:16,borderCollapse:"collapse"}}>

            <thead>
              <tr>
                <th>符/翻</th>
                {hans.map(h=><th key={h}>{h}翻</th>)}
              </tr>
            </thead>

            <tbody>

              {rows.map(fu=>(
                <tr key={fu}>
                  <td>{fu}符</td>

                  {hans.map(han=>{

                    const key=`${fu}-${han}`;
                    const exists=scoreTable[mode]?.[key];
                    const result=results[key];

                    let bg="white";
                    if(!exists) bg="#e5e5e5";
                    else if(result) bg=result.correct?"#ccffcc":"#ffcccc";

                    return(
                      <td key={key}
                        style={{border:"1px solid #ccc",background:bg,minWidth:90}}
                      >
                        {exists ? (
                          <input
                            ref={el=>inputRefs.current[key]=el}
                            value={answers[key]||""}
                            onChange={e=>handleChange(key,e.target.value)}
                            onKeyDown={e=>{
                              if(e.key==="Enter"){
                                e.preventDefault();
                                moveNext(key);
                              }
                            }}
                            style={{width:70,fontSize:16}}
                          />
                        ) : "---"}

                        {result && !result.correct &&
                          <div style={{fontSize:11}}>
                            正解:{result.answer}
                          </div>
                        }

                      </td>
                    );

                  })}

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    );

  }

  return isMobile ? <MobileView/> : <DesktopView/>;

}