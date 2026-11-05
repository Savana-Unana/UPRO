import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchMateBuckets, getMateStatus } from '../../utils/mateData.js'
import './timeline.css'

const STATIC = 'assets/audio/static.mp3'
const discoveredKey = 'upro_submitted_accounts'
const accountInputsKey = 'upro_submitted_account_inputs'
const n = value => String(value || '').trim().toLowerCase()
const formatElapsed = totalSeconds => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours,minutes,seconds].map(value => String(value).padStart(2,'0')).join(':')
}
const go = path => window.uproNavigate?.(path) || window.location.assign(path)
const openAnimate = (name, lost = false) => { sessionStorage.setItem('upro_open_animate', name); if (lost) sessionStorage.setItem('upro_lost_flash', 'true'); go('/animatrix') }

function EmpireGrid({username,human,drops,onSubmit}){
  const order=useMemo(()=>{
    const tiles=Array.from({length:16},(_,index)=>index)
    for(let index=tiles.length-1;index>0;index--){const swap=Math.floor(Math.random()*(index+1));[tiles[index],tiles[swap]]=[tiles[swap],tiles[index]]}
    return tiles
  },[])
  return <div className="empire-grid" aria-hidden="true">{order.map((source,target)=>{const containsForm=[6,7,10,11].includes(source);return <div className={`empire-slice ${containsForm?'has-enter':''}`} key={target} onClick={containsForm?onSubmit:undefined}><div className="empire-page-copy" style={{'--source-row':Math.floor(source/4),'--source-column':source%4}}><button className="timeline-exit" type="button">Exit</button><section className="timeline-login"><h1>Please Enter {human?'Human Name':'Username'}</h1><div className="timeline-form"><div className="timeline-input">{username}</div><div className="timeline-enter" style={{marginTop:`${drops*10}px`}}>Enter</div></div></section></div></div>})}</div>
}

const GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbxdMBtvITZc_PWwlQzZMU3H2JivtIkdkfn7ZB0Y6UvxXeZUIWXRsHOY01iN117fVkknjw/exec'
const starQuestionnaire={
  outside:{prompt:'Are the stars outside?',choices:[{label:'Yes',next:'falling'},{label:'No',next:'missing'}]},
  falling:{prompt:'Are the stars falling?',choices:[{label:'Yes',next:'sky'},{label:'No',next:'missing'}]},
  missing:{prompt:'Are the stars missing?',choices:[{label:'Yes',message:'Well then, you should begin to open your eyes.'},{label:'No',next:'identifiable'}]},
  sky:{prompt:'Are the stars still in the sky?',choices:[{label:'Yes',message:'Well then, we still have time.'},{label:'No',next:'ground'}]},
  identifiable:{prompt:'Are the stars identifiable?',choices:[{label:'Yes',next:'star'},{label:'No',message:'Then they might as well be missing.'}]},
  ground:{prompt:'Are the stars on the ground?',choices:[{label:'Yes',message:'"Canis 9 Major"'},{label:'No',next:'perfect'}]},
  star:{prompt:'Can I be a star?',choices:[{label:'Yes',next:'definition'},{label:'No',message:'I apologize.'}]},
  perfect:{prompt:'Are the stars perfect?',choices:[{label:'Yes',message:'Thank you. I forgive you, if you forgive me for wasting your time.'},{label:'No',message:"You're wrong."}]},
  definition:{prompt:'What is a star?',response:true},
}

function StarsPrompt(){
  const [step,setStep]=useState('outside'),[message,setMessage]=useState(''),[answer,setAnswer]=useState(''),[sending,setSending]=useState(false),[error,setError]=useState('')
  const question=step?starQuestionnaire[step]:null
  const choose=choice=>{if(choice.message){setMessage(choice.message);setStep('')}else setStep(choice.next)}
  const submitAnswer=async event=>{
    event.preventDefault();if(!answer.trim()||sending)return;setSending(true);setError('')
    try{const body=new URLSearchParams({action:'historyResponse',question:starQuestionnaire.definition.prompt,answer:answer.trim()});const response=await fetch(GOOGLE_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:body.toString(),keepalive:true,signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error('Unable to save your answer. Please try again.');const result=await response.json();if(result.ok!==true||result.sheet!=='History Responses')throw new Error('Unable to confirm your answer was saved. Please try again.');setMessage('You are a star.');setStep('');setAnswer('')}catch(caught){setError(caught instanceof Error?caught.message:'Unable to save your answer. Please try again.')}finally{setSending(false)}
  }
  return <main className="timeline-shell is-yellow"><button className="timeline-exit" type="button" onClick={()=>go('/')}>Exit</button><section className="timeline-login timeline-questionnaire">{question?<><h1>{question.prompt}</h1>{question.response?<form className="timeline-form timeline-response-form" onSubmit={submitAnswer}><input className="timeline-input" value={answer} disabled={sending} onChange={event=>setAnswer(event.target.value)} autoFocus/><button className="timeline-enter" type="submit" disabled={sending||!answer.trim()}>{sending?'Sending...':'Send'}</button><p className="timeline-status is-incorrect">{error}</p></form>:<div className="timeline-choices">{question.choices.map((choice,index)=><button className="timeline-choice" type="button" key={choice.label} onClick={()=>choose(choice)}><span>{index+1}.</span>{choice.label}</button>)}</div>}</>:<h1 className="timeline-message">{message}</h1>}</section></main>
}

const accounts = [
  {display:'Animate',aliases:[],effect:'Opens Animate’s Info.'},
  {display:'Lost Animate',aliases:[],effect:'Open Animate’s Info?'},
  {display:'Perfecatoly',aliases:['chef','chef perfecatoly','chef paccherio','paccherio','chef paccherio perfecatoly','paccherio perfecatoly','perfecatoly'],effect:'Loads the “Friend Inside Me” page.',path:'/friend'},
  {display:'Skip',aliases:['skip'],effect:'Loads the Friendskip page.',path:'/friendskip',static:true},
  {display:'Chip',aliases:['chip'],effect:'Lowers the enter button.',typed:'chip'},
  {display:'Dip',aliases:['dip'],effect:'Times water-time.',typed:'dip'},
  {display:'Pip',aliases:['pip'],effect:'Enter Button taunts you.',typed:'pip'},
  {display:'Dad',aliases:['dad','dave'],effect:'Loads a random catch.',group:'Wild Catch'},
  {display:'Mom',aliases:['mom','june'],effect:'Loads the asks page.',path:'/asks'},
  {display:'Ghouliath',aliases:['ghouliath','fear'],effect:'',delay:'Ghouliath'},
  {display:'Lemody',aliases:['lemody','nature'],effect:'Loads Lemody’s entry.',animate:'Lemody'},
  {display:'Aestereg',aliases:['aestereg','reverense','moteeph','truth'],effect:'I know everything.',marvin:true},
  {display:'Pydromaglar',aliases:['pydromaglar','energy'],effect:'The page’s energy is absorbed.',delay:'Pydromaglar',short:true},
  {display:'Mysterious Trader',aliases:['maya','mt','mysterious trader','trader'],effect:'MT sneaks past.',typed:'trader'},
  {display:'Dopplergrail',aliases:['doppler','dop','dopplergrail','cuddol','self','vanity'],effect:'Let him hear you.',animate:'Dopplergrail',static:true},
  {display:'Cerebrilith',aliases:['cerebrilith'],effect:'Split in two.',typed:'split',animate:'Cerebrilith'},
  {display:'Frostbite',aliases:['frostbite'],effect:'Turns Radioactive',typed:'flicker',animate:'Frostbite'},
  {display:'Empire Vigilith',aliases:['empire vigilith','empire','empilith'],effect:'Split between many viewpoints.',typed:'grid',animate:'Empire Vigilith'},
  {display:'Spongus',aliases:['spongus','growth'],effect:'It’s growth.',spongus:true},
  {display:'Zip',aliases:['zip'],effect:'Loads the Under Construction page.',path:'/construction'},
  {display:'Apothelugh',aliases:['apothelugh','twomew'],effect:'Protects his people.',apothe:true},
  {display:'Kal',aliases:['kal','flamethrower','kal kaua','flamethrower molotov'],effect:'Runaway from the problems.',reload:true},
  {display:'CC',aliases:['cc','capture capsule','capsule'],effect:'Loads a random Animate.',finalized:true},
  {display:'Bewag',aliases:['bewag'],effect:'',animate:'Bewag',static:true},
  {display:'Blarb',aliases:['blarb','blarbious francais iii'],effect:'Blarb shows his splendor.',animate:'Blarb'},
  {display:'Borgo Slor',aliases:['borgo slor'],effect:'Borgo Slor',animate:'Borgo Slor'},
  {display:'Mark Scott',aliases:['mark scott','mark','scott'],effect:'Loads the Normal page.',path:'/normal'},
  {display:'Prof. Smogsworth',aliases:['smogsworth','masrich','masrich smogsworth','prof. smogsworth','prof. masrich smogsworth'],effect:'Sends out the forces.',biome:'Lab Fungen'},
  {display:'Randal Shivers',aliases:['randal','randal shivers'],effect:'Display the product line.',nameMatch:'Shiver'},
  {display:'Randy Shivers',aliases:['randy','raegan','ronald','shivers'],effect:'Turns everything radioactive.',typed:'yellow'},
  {display:'Marvin',aliases:['marvin'],effect:'Shows your humanity.',human:true},
  {display:'Rip',aliases:['rip'],effect:'null',rip:true},
  {display:'Cran_Bot',aliases:['shane','cran_bot','shaniqua','cranunerscrbot','voos','shaniqua viss','viss','shaniqua voos','unknown ringtone','glitchygamer'],effect:'Loads the Main Menu.',path:'/'},
  {display:'Jimm560',aliases:['jimm560','jimm'],effect:'Loads the OST page.',ost:'Jimm'},
  {display:'Octoking',aliases:['eliav','octoking','eliav eichler','eichler'],effect:'Loads the OST page.',ost:'Octoking'},
  {display:'Jakedacake',aliases:['jake','jusicdamusic','jakedacake','jakedafreak','jake explains it all','jake kravetz','dafreak'],effect:'Loads the Jake.',jake:true},
  {display:'Ari Films',aliases:['ari','ari films','ari preciado'],effect:'Loads the OST page.',ost:'Ari'},
  {display:'Ariel Salama',aliases:['ariel salama','ariel','salama'],effect:'Loads THE WEBSITE.',external:'https://savana-unana.github.io/BandOfBelaters/'},
  {display:'Amorayah',aliases:['amo','amorayah','gremlinizi','gremlinzini'],effect:'Loads the Animatrix.',path:'/animatrix',amoScale:true},
  {display:'Ivri',aliases:['ivri','irvi','ivri rogovsky','rogovsky'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Shaina',aliases:['shaina'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Aviva',aliases:['aviva','aviva zippin','zippin'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Tal',aliases:['tal'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Harv',aliases:['harv','haventon','harv haventon','harvhav'],effect:'Acceptance.',accept:true},
  {display:'Aurorial',aliases:['aurorial'],effect:'The stars she’s hurt.',animate:'Aurorial',stars:true},
  {display:'Riley Shivers',aliases:['riley','riley shivers'],effect:'The horrors.',path:'/animatrix?event=halloween'},
  {display:'Cosmicanine',aliases:['cosmicanine','doggi'],effect:'Absorption is absolute.',animate:'Cosmicanine',hideExit:true},
  {display:'Herc',aliases:['herc'],effect:'Shop lifting.',typed:'herc'},
  {display:'Brianna Kaua',aliases:['brianna','kaua','brianna kaua'],effect:'Reposition has acquired your pc.',ost:'Reposition'},
  {display:'Karl Molotov',aliases:['karl','karl molotov','molotov'],effect:'Spitting heat and fire.',path:'/animatrix?type=Fire'},
  {display:'Markara',aliases:['markara','freedom'],effect:'Loads Markara’s entry.',animate:'Markara'},
  {display:'Pseudogons',aliases:['tralgon','aguipesh','thundrake'],effect:'Loads the selected Pseudogon.',selected:true},
  {display:'Exosteel',aliases:['exosteel','worth'],effect:'Loads the worthy.',group:'The Worthy'},
]

export default function TimelinePage() {
  const [username,setUsername]=useState(''), [status,setStatus]=useState(''), [drops,setDrops]=useState(0), [human,setHuman]=useState(false), [crash,setCrash]=useState(false), [ripFlash,setRipFlash]=useState(false)
  const [waterSeconds,setWaterSeconds]=useState(0)
  const [showStars]=useState(()=>{const forced=sessionStorage.getItem('upro_force_stars')==='true';if(forced)sessionStorage.removeItem('upro_force_stars');return forced||Math.floor(Math.random()*30)===0})
  const [pipStep,setPipStep]=useState(0), [accountsOpen,setAccountsOpen]=useState(false), [hercLifts,setHercLifts]=useState(0), [submittedTyped,setSubmittedTyped]=useState('')
  const [mates,setMates]=useState([]), [groups,setGroups]=useState([]), [found,setFound]=useState(()=>new Set(JSON.parse(localStorage.getItem(discoveredKey)||'[]')))
  const [accountInputs,setAccountInputs]=useState(()=>JSON.parse(localStorage.getItem(accountInputsKey)||'{}'))
  const inputRef=useRef(null), audioRef=useRef(null), value=n(username)
  const traderPass=useMemo(()=>({top:`${8+Math.random()*64}%`,reverse:Math.random()<.5}),[])
  useEffect(()=>{ document.title='Ê˜'; document.body.className='timeline-page'; document.body.setAttribute('style',''); Promise.all([fetchMateBuckets(),fetch('data/mates/groups.json').then(r=>r.json())]).then(([b,g])=>{setMates(Object.values(b).flat().filter(x=>x?.name));setGroups(g)}); return()=>audioRef.current?.pause() },[])
  const current=useMemo(()=>accounts.find(a=>a.aliases.includes(value)),[value]), typed=current?.typed||''
  const liveTyped=['pip','split','grid'].includes(typed)?typed:''
  const activeTyped=liveTyped||submittedTyped
  useEffect(()=>{ if(activeTyped!=='dip'){setWaterSeconds(0);return undefined} const started=Date.now(),timer=setInterval(()=>setWaterSeconds(Math.floor((Date.now()-started)/1000)),250); return()=>clearInterval(timer) },[activeTyped])
  useEffect(()=>{ if(typed!=='pip')setPipStep(0) },[typed])
  const playStatic=(seconds=3)=>{audioRef.current||=new Audio(STATIC);audioRef.current.volume=.08;audioRef.current.currentTime=0;audioRef.current.play().catch(()=>{});setTimeout(()=>audioRef.current?.pause(),seconds*1000)}
  const remember=(display,input)=>{
    const savedFound=new Set(JSON.parse(localStorage.getItem(discoveredKey)||'[]'))
    savedFound.add(display)
    localStorage.setItem(discoveredKey,JSON.stringify([...savedFound]))
    setFound(new Set(savedFound))
    if(input){
      const savedInputs={...JSON.parse(localStorage.getItem(accountInputsKey)||'{}'),[display]:input}
      localStorage.setItem(accountInputsKey,JSON.stringify(savedInputs))
      setAccountInputs(savedInputs)
    }
  }
  useEffect(()=>{
    if(!current)return
    if(typed==='split'||typed==='grid'||(typed==='pip'&&pipStep>=5))remember(current.display,value)
  },[current,typed,pipStep,value])
  const random=list=>list[Math.floor(Math.random()*list.length)]
  function run(a, original){
    remember(a.display,original); if(a.static)playStatic(); if(a.stars)sessionStorage.setItem('upro_force_stars','true'); if(a.hideExit)sessionStorage.setItem('upro_hide_main_exit','true'); if(a.amoScale)sessionStorage.setItem('upro_amo_animatrix_scale','true')
    if(a.reload){sessionStorage.clear();return window.location.reload()} if(a.external)return window.location.assign(a.external)
    if(a.rip){
      setRipFlash(true)
      playStatic(3)
      return setTimeout(()=>{
        setRipFlash(false)
        setCrash(true)
        setTimeout(()=>go('/friendskip'),2000)
      },1000)
    }
    if(a.human){setHuman(true);return setStatus('')}
    if(a.marvin)return setStatus('Hello! Your username is “Harv”')
    if(a.delay){setCrash(true);return setTimeout(()=>openAnimate(a.delay),a.short?500:2000)}
    if(a.spongus){
      const pages=['/normal','/guesswho','/encoder','/upro-rdle','/guessr']
      for(let i=pages.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pages[i],pages[j]]=[pages[j],pages[i]]}
      const [first,...remaining]=pages
      sessionStorage.setItem('upro_spongus_sequence',JSON.stringify([...remaining,'animate:Spongus']))
      return go(first)
    }
    if(a.apothe){
      const protectedMate=random(mates.filter(m=>m.name!=='Apothelugh'&&m.biomes?.includes('Ieland')))
      if(!protectedMate)return openAnimate('Apothelugh')
      sessionStorage.setItem('upro_followup_animate','Apothelugh')
      return openAnimate(protectedMate.name)
    }
    if(a.animate)return a.static?setTimeout(()=>openAnimate(a.animate),3000):openAnimate(a.animate)
    if(a.selected)return openAnimate(original); if(a.ost)return go(`/ost?composer=${encodeURIComponent(a.ost)}`)
    if(a.jake)return Math.random()<.5?go('/animatrix'):go('/ost?composer=Jakedacake')
    if(a.group){const g=groups.find(x=>x.name===a.group),name=random(g?.animates||[]);return name&&openAnimate(name)}
    if(a.biome){const name=random(mates.filter(m=>m.biomes?.includes(a.biome)))?.name;return name&&openAnimate(name)}
    if(a.nameMatch){const name=random(mates.filter(m=>m.name.includes(a.nameMatch)))?.name;return name&&openAnimate(name)}
    if(a.finalized){const name=random(mates.filter(m=>getMateStatus(m)==='finalized'))?.name;return name&&openAnimate(name)}
    if(a.path)return go(a.path); if(a.accept)setStatus('Accepted!')
  }
  function submit(e){
    e.preventDefault()
    const submitted=value
    if(current){
      if(typed==='pip'&&pipStep<5)return
      remember(current.display,submitted)
      setStatus('')
      if(typed==='chip')setDrops(count=>count+1)
      if(typed==='herc')setHercLifts(count=>count+1)
      setSubmittedTyped(['dip','yellow','trader','flicker'].includes(typed)?typed:'')
      setUsername('')
      if(typed==='flicker'&&current.animate){setTimeout(()=>openAnimate(current.animate),1000);return}
      if(!['chip','dip','pip','trader','herc'].includes(typed))run(current,submitted)
      return
    }
    const mate=mates.find(m=>n(m.name)===submitted||String(m.id??'')===submitted)
    setUsername('')
    setSubmittedTyped('')
    if(mate){remember(getMateStatus(mate)==='conceptualized'?'Lost Animate':'Animate',submitted);return openAnimate(mate.name,getMateStatus(mate)==='conceptualized')}
    setStatus('Incorrect.')
    inputRef.current?.focus()
  }
  if(showStars)return <StarsPrompt/>
  const cls=['timeline-shell',activeTyped==='yellow'&&'is-yellow',activeTyped==='split'&&'is-split',activeTyped==='grid'&&'is-grid',activeTyped==='flicker'&&'is-flicker',activeTyped==='dip'&&'is-dip',ripFlash&&'is-rip-flash',crash&&'is-crashed'].filter(Boolean).join(' ')
  return <main className={cls}><button className="timeline-exit" type="button" onClick={()=>go('/')}>Exit</button>{activeTyped==='grid'&&<EmpireGrid username={username} human={human} drops={drops} onSubmit={()=>inputRef.current?.form?.requestSubmit()}/>} {activeTyped==='dip'&&<output className="timeline-water-timer">{formatElapsed(waterSeconds)}</output>}<section className="timeline-login"><h1 style={{transform:`translateY(-${hercLifts*10}px)`}}>Please Enter {human?'Human Name':'Username'}</h1><form className="timeline-form" onSubmit={submit}><input ref={inputRef} className="timeline-input" value={username} onChange={e=>{setUsername(e.target.value);setSubmittedTyped('')}} aria-label={human?'Human name':'Username'} autoComplete="off" autoCapitalize="none" spellCheck="false" autoFocus/><button className={`timeline-enter ${typed==='pip'?`is-taunting pip-step-${pipStep}`:''}`} type="submit" style={{marginTop:`${drops*10}px`}} onMouseEnter={()=>typed==='pip'&&setPipStep(step=>Math.min(step+1,5))} onClick={e=>{if(typed==='pip'&&pipStep<5)e.preventDefault()}}>Enter</button></form><p className={`timeline-status ${status==='Incorrect.'?'is-incorrect':'is-accepted'}`}>{status}</p></section>{activeTyped==='trader'&&<img className={`timeline-walker ${traderPass.reverse?'is-reverse':''}`} style={{top:traderPass.top}} src="assets/images/ui/MysteriousTrader.png" alt="" aria-hidden="true"/>}<button className="timeline-accounts-toggle" type="button" aria-expanded={accountsOpen} onClick={()=>setAccountsOpen(open=>!open)}>Accounts</button>{accountsOpen&&<aside className="timeline-accounts"><div className="timeline-accounts-heading"><h2>Accounts</h2><button type="button" onClick={()=>setAccountsOpen(false)} aria-label="Close Accounts">×</button></div>{accounts.map(a=>{const unlocked=found.has(a.display),insert=accountInputs[a.display]||a.aliases[0];return <button type="button" key={a.display} className={unlocked?'is-found':''} disabled={!unlocked||!insert} onClick={()=>{setUsername(insert);setSubmittedTyped('');setAccountsOpen(false);requestAnimationFrame(()=>inputRef.current?.focus())}}><strong>{unlocked?a.display:'???'}</strong>{unlocked&&<><small>{a.aliases.join(', ')}</small><span>{a.effect}</span></>}</button>})}</aside>}</main>
}
