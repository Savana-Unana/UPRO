import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchMateBuckets, getMateStatus } from '../../utils/mateData.js'
import { activateSkipStatic } from '../../utils/usePageStatic.js'
import './timeline.css'

const STATIC = 'assets/audio/static.mp3'
const TWAILET = `${import.meta.env.BASE_URL}assets/audio/Twailet.mp3`
const cursePatterns = [/shit/i,/ni[a-z]{2}er/i,/ni[a-z]{2}a/i,/f[a-z]ck/i,/d[a-z]mn/i,/[a-z]{2}tard/i,/cunt/i,/cum/i,/bitch/i]
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

const accountEntries = [
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
  {display:'Lemody',aliases:['lemody','nature'],effect:'Run away!',lemody:true},
  {display:'Aestereg',aliases:['aestereg','reverense','moteeph','truth'],effect:'I know everything.',aestereg:true},
  {display:'Pydromaglar',aliases:['pydromaglar','energy'],effect:'The page’s energy is absorbed.',absorb:true},
  {display:'MT',aliases:['maya','mt','mysterious trader','trader'],effect:'MT sneaks past.',typed:'trader'},
  {display:'Dopplergrail',aliases:['doppler','dop','dopplergrail','self','vanity'],effect:'Let him hear you.',animate:'Dopplergrail',static:true},
  {display:'Cerebrilith',aliases:['cerebrilith'],effect:'Split in two.',typed:'split',animate:'Cerebrilith'},
  {display:'Frostbite',aliases:['frostbite'],effect:'Turns Radioactive',typed:'flicker',animate:'Frostbite'},
  {display:'Empire Vigilith',aliases:['empire vigilith','empire','empilith'],effect:'Split between many viewpoints.',typed:'grid',animate:'Empire Vigilith'},
  {display:'Spongus',aliases:['spongus','growth'],effect:'It’s growth.',spongus:true},
  {display:'Zip',aliases:['zip'],effect:'Loads the Under Construction page.',path:'/construction'},
  {display:'Apothelugh',aliases:['apothelugh','twomew'],effect:'Protects his people.',apothe:true},
  {display:'Kal',aliases:['kal','flamethrower','kal kaua','flamethrower molotov'],effect:'Runaway from the problems.',reload:true},
  {display:'CC',aliases:['cc','capture capsule','capsule'],effect:'Loads a random Animate.',finalized:true},
  {display:'Bewag',aliases:['bewag'],effect:'',animate:'Bewag',static:true},
  {display:'Blarb',aliases:['blarb','blarbious francais iii'],effect:'Blarb shows his splendor.',animate:'Blarb',blarb:true},
  {display:'Borgo Slor',aliases:['borgo slor'],effect:'Borgo Slor',animate:'Borgo Slor',borgo:true},
  {display:'Mark Scott',aliases:['mark scott','mark','scott'],effect:'Loads the Normal page.',path:'/normal'},
  {display:'Prof. Smogsworth',aliases:['smogsworth','masrich','masrich smogsworth','prof. smogsworth','prof. masrich smogsworth'],effect:'Sends out the forces.',biome:'Lab Fungen'},
  {display:'Randal Shivers',aliases:['randal','randal shivers'],effect:'Display the product line.',nameMatch:'Shiver'},
  {display:'Randy Shivers',aliases:['randy','raegan','ronald','shivers'],effect:'Turns everything radioactive.',typed:'yellow'},
  {display:'Marvin',aliases:['marvin'],effect:'Shows your humanity.',human:true},
  {display:'Rip',aliases:['rip'],effect:'null',rip:true},
  {display:'Cran_Bot',aliases:['shane','cran_bot','shaniqua','cranunerscrbot','voos','shaniqua viss','viss','shaniqua voos','unknown ringtone','glitchygamer'],effect:'Loads the Main Menu.',path:'/'},
  {display:'Jimm560',aliases:['jimm560','jimm'],effect:'Loads the OST page.',ost:'Jimm560'},
  {display:'Octoking',aliases:['eliav','octoking','eliav eichler','eichler'],effect:'Loads the OST page.',ost:'OctoKing'},
  {display:'Jakedacake',aliases:['jake','jusicdamusic','jakedacake','jakedafreak','jake explains it all','jake kravetz','dafreak'],effect:'Loads the Jake.',jake:true},
  {display:'Ari Films',aliases:['ari','ari films','ari preciado'],effect:'Loads the OST page.',ost:'AriFilms'},
  {display:'Ariel',aliases:['ariel salama','ariel','salama'],effect:'Loads THE WEBSITE.',external:'https://savana-unana.github.io/BandOfBelaters/'},
  {display:'Gremlinizi',aliases:['amo','amorayah','gremlinizi','gremlinzini'],effect:'Loads the Animatrix.',path:'/animatrix',amoScale:true},
  {display:'Ivri',aliases:['ivri','irvi','ivri rogovsky','rogovsky'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Shaina',aliases:['shaina'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Aviva',aliases:['aviva','aviva zippin','zippin'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Tcy35t',aliases:['tal','tcy35t'],effect:'Loads the Animatrix.',path:'/animatrix'},
  {display:'Harv',aliases:['harv','haventon','harv haventon','harvhav'],effect:'Acceptance.',accept:true},
  {display:'Aurorial',aliases:['aurorial'],effect:'The stars she’s hurt.',animate:'Aurorial',stars:true},
  {display:'Riley Shivers',aliases:['riley','riley shivers'],effect:'The horrors.',path:'/animatrix?event=halloween'},
  {display:'Cosmicanine',aliases:['cosmicanine','doggi'],effect:'Absorption is absolute.',animate:'Cosmicanine',hideExit:true},
  {display:'Herc',aliases:['herc'],effect:'Shop lifting.',typed:'herc'},
  {display:'Brianna Kaua',aliases:['brianna','kaua','brianna kaua'],effect:'Reposition has acquired your pc.',ostSearch:'Reposition'},
  {display:'Karl Molotov',aliases:['karl','karl molotov','molotov'],effect:'Spitting heat and fire.',path:'/animatrix?type=Fire'},
  {display:'Vincent',aliases:['vincent'],effect:'Do you hear the ringing?',static:true,ostSearch:'Demolition'},
  {display:'Markara',aliases:['markara','freedom'],effect:'Graffiti Master!',graffiti:true},
  {display:'Arlan',aliases:['arlan','arlen','bartfeld','arlan bartfeld'],effect:'Why is he here?',external:'https://weather.com/'},
  {display:'Glitched 0ut',aliases:['peak','michael','abbou','michael abbou','peak abbou','glitched 0ut','glitched out'],effect:'Loads the OST page.',ost:'Glitched 0ut'},
  {display:'Pseudogons',aliases:['tralgon','aguipesh','thundrake'],effect:'Loads the selected Pseudogon.',selected:true},
  {display:'Exosteel',aliases:['exosteel','worth'],effect:'Loads the worthy.',group:'The Worthy'},
]
const accountOrder = 'Harv|Cran_Bot|Jakedacake|Glitched 0ut|Octoking|Tcy35t|Gremlinizi|Ari Films|Ariel|Aviva|Ivri|Shaina|Jimm560|Arlan|Rip|Skip|Chip|Pip|Dip|Zip|Dad|Mom|Kal|MT|Herc|Marvin|Brianna Kaua|Perfecatoly|Karl Molotov|Vincent|Mark Scott|Prof. Smogsworth|Randal Shivers|Randy Shivers|Riley Shivers|CC|Animate|Blarb|Ghouliath|Lemody|Frostbite|Lost Animate|Bewag|Cerebrilith|Borgo Slor|Empire Vigilith|Pseudogons|Spongus|Exosteel|Aestereg|Pydromaglar|Markara|Dopplergrail|Cosmicanine|Apothelugh|Aurorial'.split('|')
const accountRank = new Map(accountOrder.map((name,index)=>[name,index]))
const accounts = [...accountEntries].sort((a,b)=>(accountRank.get(a.display)??Infinity)-(accountRank.get(b.display)??Infinity))
const oldAccountNames = {'Mysterious Trader':'MT',Shane:'Cran_Bot',Jake:'Jakedacake',Eliav:'Octoking',Amorayah:'Gremlinizi',Amo:'Gremlinizi',Tal:'Tcy35t','Ariel Salama':'Ariel'}

export default function TimelinePage() {
  const [username,setUsername]=useState(''), [status,setStatus]=useState(''), [drops,setDrops]=useState(0), [human,setHuman]=useState(false), [crash,setCrash]=useState(false), [ripFlash,setRipFlash]=useState(false)
  const [waterSeconds,setWaterSeconds]=useState(0), [dipActive,setDipActive]=useState(false), [randyActive,setRandyActive]=useState(false)
  const [frostbiteActive,setFrostbiteActive]=useState(false), [frostbiteFlash,setFrostbiteFlash]=useState(false), [energyAbsorbed,setEnergyAbsorbed]=useState(false)
  const [showStars]=useState(()=>{const forced=sessionStorage.getItem('upro_force_stars')==='true';if(forced)sessionStorage.removeItem('upro_force_stars');return forced||Math.floor(Math.random()*30)===0})
  const [pipStep,setPipStep]=useState(0), [accountsOpen,setAccountsOpen]=useState(false), [hercLifts,setHercLifts]=useState(0), [submittedTyped,setSubmittedTyped]=useState('')
  const [promptStage,setPromptStage]=useState(0), [idleSmile,setIdleSmile]=useState(false), [wrongCount,setWrongCount]=useState(0)
  const [mates,setMates]=useState([]), [npcs,setNpcs]=useState([]), [groups,setGroups]=useState([]), [found,setFound]=useState(()=>new Set(JSON.parse(localStorage.getItem(discoveredKey)||'[]').map(name=>oldAccountNames[name]||name)))
  const [accountInputs,setAccountInputs]=useState(()=>Object.fromEntries(Object.entries(JSON.parse(localStorage.getItem(accountInputsKey)||'{}')).map(([name,input])=>[oldAccountNames[name]||name,input])))
  const inputRef=useRef(null), audioRef=useRef(null), twailetRef=useRef(null), redirectTimerRef=useRef(null), value=n(username)
  useEffect(()=>{ document.title = '⊙'; document.body.className='timeline-page'; document.body.setAttribute('style',''); Promise.all([fetchMateBuckets({includeNpc:true}),fetch('data/mates/groups.json').then(r=>r.json())]).then(([b,g])=>{setMates(Object.entries(b).filter(([mode])=>mode!=='npc').flatMap(([,items])=>Array.isArray(items)?items:[]).filter(x=>x?.name));setNpcs(b.npc||[]);setGroups(g)}); return()=>{audioRef.current?.pause();twailetRef.current?.pause();clearTimeout(redirectTimerRef.current)} },[])
  useEffect(()=>{if(promptStage!==2||username.trim())return undefined;const timer=setTimeout(()=>setIdleSmile(true),3000);return()=>clearTimeout(timer)},[promptStage,username])
  const current=useMemo(()=>accounts.find(a=>a.aliases.includes(value)),[value]), typed=current?.typed||''
  const liveTyped=['pip','split','grid'].includes(typed)?typed:''
  const activeTyped=liveTyped||submittedTyped
  useEffect(()=>{ if(!dipActive){setWaterSeconds(0);return undefined} const started=Date.now(),timer=setInterval(()=>setWaterSeconds(Math.floor((Date.now()-started)/1000)),250); return()=>clearInterval(timer) },[dipActive])
  useEffect(()=>{if(!frostbiteActive)return undefined;const timer=setInterval(()=>setFrostbiteFlash(flash=>!flash),150);return()=>clearInterval(timer)},[frostbiteActive])
  useEffect(()=>{ if(typed!=='pip')setPipStep(0) },[typed])
  const playStatic=(seconds=3)=>{audioRef.current||=new Audio(STATIC);audioRef.current.volume=.08;audioRef.current.currentTime=0;audioRef.current.play().catch(()=>{});setTimeout(()=>audioRef.current?.pause(),seconds*1000)}
  const playTwailet=()=>{twailetRef.current||=new Audio(TWAILET);twailetRef.current.currentTime=0;twailetRef.current.play().catch(()=>{})}
  const remember=(display,input)=>{
    const savedFound=new Set(JSON.parse(localStorage.getItem(discoveredKey)||'[]').map(name=>oldAccountNames[name]||name))
    savedFound.add(display)
    localStorage.setItem(discoveredKey,JSON.stringify([...savedFound]))
    setFound(new Set(savedFound))
    if(input){
      const savedInputs={...accountInputs,[display]:input}
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
    remember(a.display,original); if(a.display==='Skip')activateSkipStatic(); else if(a.static)playStatic(); if(a.stars)sessionStorage.setItem('upro_force_stars','true'); if(a.hideExit)sessionStorage.setItem('upro_hide_main_exit','true'); if(a.amoScale)sessionStorage.setItem('upro_amo_animatrix_scale','true')
    if(a.reload){setDipActive(false);sessionStorage.clear();return window.location.reload()} if(a.external)return window.location.assign(a.external)
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
    if(a.aestereg){
      const name=original==='truth'?random(['Aestereg','Reverense','Moteeph']):original==='moteeph'?'Moteeph':original==='reverense'?'Reverense':'Aestereg'
      setStatus('Hello! Your username is “Harv”')
      clearTimeout(redirectTimerRef.current)
      redirectTimerRef.current=setTimeout(()=>openAnimate(name),1000)
      return
    }
    if(a.graffiti){window.dispatchEvent(new CustomEvent('upro-effect',{detail:'graffiti'}));redirectTimerRef.current=setTimeout(()=>openAnimate('Markara'),2000);return}
    if(a.lemody){sessionStorage.setItem('upro_lemody_map','true');return go('/map')}
    if(a.absorb){setEnergyAbsorbed(true);redirectTimerRef.current=setTimeout(()=>openAnimate('Pydromaglar'),1500);return}
    if(a.blarb)window.dispatchEvent(new CustomEvent('upro-effect',{detail:'blarb'}))
    if(a.borgo){window.uproBorgoSlor=true;window.dispatchEvent(new CustomEvent('upro-effect',{detail:'borgo'}))}
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
    if(a.ostSearch)return a.static?setTimeout(()=>go(`/ost?search=${encodeURIComponent(a.ostSearch)}`),3000):go(`/ost?search=${encodeURIComponent(a.ostSearch)}`)
    if(a.jake)return Math.random()<.5?go('/animatrix'):go('/ost?composer=JakeDaCake')
    if(a.group){const g=groups.find(x=>x.name===a.group),name=random(g?.animates||[]);return name&&openAnimate(name)}
    if(a.biome){const name=random(mates.filter(m=>m.biomes?.includes(a.biome)))?.name;return name&&openAnimate(name)}
    if(a.nameMatch){const name=random(mates.filter(m=>m.name.includes(a.nameMatch)))?.name;return name&&openAnimate(name)}
    if(a.finalized){const name=random(mates.filter(m=>getMateStatus(m)==='finalized'))?.name;return name&&openAnimate(name)}
    if(a.path)return go(a.path); if(a.accept)setStatus('Accepted!')
  }
  function submit(e){
    e.preventDefault()
    const submitted=value
    const wrong=()=>{setStatus('Incorrect.');if(wrongCount>=2)go('/');else setWrongCount(count=>count+1);inputRef.current?.focus()}
    if(!submitted)return
    clearTimeout(redirectTimerRef.current)
    const cursed=cursePatterns.some(pattern=>pattern.test(submitted))
    if(cursed){playTwailet();setUsername('');setSubmittedTyped('');setStatus('');setWrongCount(0);return}
    const npc=npcs.find(m=>n(m.name)===submitted)
    const mate=mates.find(m=>n(m.name)===submitted||String(m.id??'')===submitted)
    if(submitted==='username'&&promptStage===0){setPromptStage(1);setUsername('');setStatus('');return}
    if(submitted==='valid username'&&promptStage===1){setPromptStage(2);setIdleSmile(false);setUsername('');setStatus('');return}
    if(current){
      if(typed==='pip'&&pipStep<5)return
      remember(current.display,submitted)
      setStatus('')
      if(typed==='chip')setDrops(count=>count+1)
      if(typed==='dip')setDipActive(true)
      if(typed==='yellow')setRandyActive(true)
      if(typed==='herc')setHercLifts(count=>count+1)
      setSubmittedTyped('')
      setUsername('')
      setWrongCount(0)
      if(typed==='trader')window.dispatchEvent(new CustomEvent('upro-effect',{detail:'trader'}))
      if(typed==='flicker'&&current.animate){setFrostbiteActive(true);setFrostbiteFlash(false);setTimeout(()=>openAnimate(current.animate),1500);return}
      if(!['chip','dip','pip','trader','herc'].includes(typed))run(current,submitted)
      return
    }
    setUsername('')
    setSubmittedTyped('')
    if(npc){return go(`/catalog?npc=${encodeURIComponent(npc.name)}`)}
    if(mate){setWrongCount(0);remember(getMateStatus(mate)==='conceptualized'?'Lost Animate':'Animate',submitted);return openAnimate(mate.name,getMateStatus(mate)==='conceptualized')}
    wrong()
  }
  if(showStars)return <StarsPrompt/>
  const accountProgress=`${accounts.filter(account=>found.has(account.display)).length}/${accounts.length}`
  const cls=['timeline-shell',(randyActive||frostbiteActive)&&'is-yellow',activeTyped==='split'&&'is-split',activeTyped==='grid'&&'is-grid',frostbiteFlash&&'is-frostbite-flash',dipActive&&'is-dip',ripFlash&&'is-rip-flash',crash&&'is-crashed',energyAbsorbed&&'is-energy-absorbed'].filter(Boolean).join(' ')
  return <main className={cls}><button className="timeline-exit" type="button" onClick={()=>go('/')}>Exit</button>{activeTyped==='grid'&&<EmpireGrid username={username} human={human} drops={drops} onSubmit={()=>inputRef.current?.form?.requestSubmit()}/>} {dipActive&&<output className="timeline-water-timer">{formatElapsed(waterSeconds)}</output>}<section className="timeline-login"><h1 style={{transform:`translateY(-${hercLifts*10}px)`}}>{human?'Please Enter Human Name':promptStage===0?'Please Enter Username':promptStage===1?'Please Enter Valid Username':idleSmile?':)':'Please Stop'}</h1><form className="timeline-form" onSubmit={submit}><input ref={inputRef} className="timeline-input" value={username} onChange={e=>{setUsername(e.target.value);setSubmittedTyped('')}} aria-label={human?'Human name':'Username'} autoComplete="off" autoCapitalize="none" spellCheck="false" autoFocus/><button className={`timeline-enter ${typed==='pip'?`is-taunting pip-step-${pipStep}`:''}`} type="submit" style={{marginTop:`${drops*10}px`}} onMouseEnter={()=>typed==='pip'&&setPipStep(step=>Math.min(step+1,5))} onClick={e=>{if(typed==='pip'&&pipStep<5)e.preventDefault()}}>Enter</button></form><p className={`timeline-status ${status==='Incorrect.'?'is-incorrect':'is-accepted'}`}>{status}</p></section><button className="timeline-accounts-toggle" type="button" aria-expanded={accountsOpen} onClick={()=>setAccountsOpen(open=>!open)}>Accounts ({accountProgress})</button>{accountsOpen&&<aside className="timeline-accounts"><div className="timeline-accounts-heading"><h2>Accounts ({accountProgress})</h2><button type="button" onClick={()=>setAccountsOpen(false)} aria-label="Close Accounts">×</button></div>{accounts.map(a=>{const unlocked=found.has(a.display),insert=accountInputs[a.display]||a.aliases[0];return <button type="button" key={a.display} className={unlocked?'is-found':''} disabled={!unlocked||!insert} onClick={()=>{setUsername(insert);setSubmittedTyped('');setAccountsOpen(false);requestAnimationFrame(()=>inputRef.current?.focus())}}><strong>{unlocked?a.display:'???'}</strong>{unlocked&&<><small>{a.aliases.join(', ')}</small><span>{a.effect}</span></>}</button>})}</aside>}</main>
}
