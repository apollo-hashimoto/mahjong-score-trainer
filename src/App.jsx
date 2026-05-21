import { useState, useRef, useEffect, useMemo } from "react";
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

  const rows=[20,25,30,40,50,60,70,80,90,100,110];
  const hans=[1,2,3,4];

  const [mode,setMode]=useState("子ロン");
  const [answers,setAnswers]=useState({});
  const [results,setResults]=useState({});

  const inputRefs=useRef({});

  // =========================
  // 🔥キー一覧を固定化（重要）
  // =========================
  const keys = useMemo(()=>{

    const list=[];

    rows.forEach(fu=>{
      hans.forEach(han=>{
        const key=`${fu}-${han}`;
        if(scoreTable[mode]?.[key]){
          list.push(key);
        }
      });
    });

    return list;

  },[mode]);

  function handleChange(key,value){
    setAnswers(prev=>({
      ...prev,
      [key]: value.replace(/[^0-9]/g,"")
    }));
  }

  function moveNext(currentKey){

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
  // 📱スマホUI（復活）
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
                      minWidth:0,
                      padding:3,
                      border:"1px solid #ddd",
                      borderRadius:6,
                      background:result
                        ? (result.correct?"#ccffcc":"#ffcccc")
                        : "white"
                    }}
                  >

                    <div style={{fontSize:10}}>
                      {han}翻
                    </div>

                    <input
                      ref={el=>inputRefs.current[key]=el}
                      type="tel"
                      inputMode="numeric"
                      value={answers[key] ?? ""}
                      onChange={e=>handleChange(key,e.target.value)}
                      onKeyDown={e=>{
                        if(e.key==="Enter"){
                          e.preventDefault();
                          moveNext(key);
                        }
                      }}
                      style={{
                        width:"100%",
                        fontSize:14,
                        textAlign:"center"
                      }}
                    />

                    <div style={{fontSize:9}}>
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
  // 💻PCUI（安定版）
  // =========================
  function DesktopView(){

    return(
      <div style={{
        padding:24,
        maxWidth:1400,
        margin:"0 auto",
        fontSize:18
      }}>

        <h1>麻雀点数表トレーニング</h1>

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

          <button onClick={grade}>採点</button>
          <button onClick={reset}>リセット</button>

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
                <td>{fu}符</td>

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
                        minWidth:110,
                        height:90,
                        background:bg
                      }}
                    >
                      {exists ? (
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

  return isMobile ? <MobileView /> : <DesktopView />;

}