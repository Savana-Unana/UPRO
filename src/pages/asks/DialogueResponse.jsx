import { useState } from 'react'

function asset(src) {
  if (!src) return ''
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`
}

// Uses the same sprite crops and card fields as the Chat dialogue builder.
export default function DialogueResponse({ cards }) {
  const [choices, setChoices] = useState({})
  return <div className="ask-dialogue-stack">{cards.map((card, index) => {
    const width = Number(card.boxWidth) || 256
    const height = Number(card.boxHeight) || 100
    const cols = Math.max(1, Number(card.iconCols) || 1)
    const rows = Math.max(1, Number(card.iconRows) || 1)
    const frame = Math.max(0, Number(card.iconFrame) || 0)
    const wide = ['iconless', 'characterless'].includes(card.boxKind)
    return <article className={`ask-dialogue-card${wide ? ' is-wide' : ''}`} key={card.id || index} aria-label={card.speaker || 'Dialogue'}>
      <div className="ask-box-viewport"><img alt="" src={asset(card.boxSrc || 'assets/images/dialogue/Dialogue_Panel.png')} style={{
        width: `${(Number(card.boxSheetWidth) || 512) / width * 100}%`,
        height: `${(Number(card.boxSheetHeight) || 700) / height * 100}%`,
        left: `${-(Number(card.boxX) || 0) / width * 100}%`,
        top: `${-(Number(card.boxY) || 0) / height * 100}%`,
      }} /></div>
      {!['nameless', 'characterless'].includes(card.boxKind) && <div className="ask-speaker">{card.speaker}</div>}
      <p className="ask-dialogue-text">{card.text}</p>
      {!wide && card.iconSrc && <div className="ask-icon-viewport"><img alt="" src={asset(card.iconSrc)} style={{
        width: `${cols * 100}%`, height: `${rows * 100}%`,
        left: `${frame % cols * -100}%`, top: `${Math.floor(frame / cols) * -100}%`,
      }} /></div>}
      {card.isChoice && <div className="ask-dialogue-choices">{(card.choices || []).map((choice, i) =>
        <button type="button" key={i} aria-pressed={(choices[index] ?? card.selectedChoice) === i}
          onClick={() => setChoices({ ...choices, [index]: i })}>{choice}</button>
      )}</div>}
    </article>
  })}</div>
}
