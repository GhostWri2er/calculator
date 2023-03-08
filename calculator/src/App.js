import './App.css';
import { useReducer } from 'react';
import DigitButton from "./digitButton.js";
import OperationButton from "./OperatioButton.js";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  // eslint-disable-next-line default-case
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
    return {
      ...state,
      currentOperand: `${state.currentOperand  || ''}${payload.digit}`
    }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluete(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state 
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
      
    // eslint-disable-next-line no-fallthrough
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluete(state),
      }
  }
     
}

function evaluete({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  // eslint-disable-next-line default-case
  switch (operation) {
    case "+":
      computation = prev + current
      break;
      // eslint-disable-next-line no-duplicate-case
    case "-":
      computation = prev - current
      break;
    // eslint-disable-next-line no-duplicate-case
    case "×":   
      computation = prev * current
      break;

    case "÷":      
      // eslint-disable-next-line no-unused-vars
      computation = prev / current
      break;
  }
  return computation.toString()
}

const integerFormatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return integerFormatter.format(integer)
  return `${integerFormatter.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="App">
      <main className="content">
        <div className="content__block">
          <div className="content__block_previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="content__block_current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <div className="content__buttons">          
          <button className="content__button" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
          <button className="content__button" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
          <OperationButton className="content__button" dispatch={dispatch} operation='%'/>
          <OperationButton className="content__button" dispatch={dispatch}operation='÷'/>
          <DigitButton className="content__button"digit='7' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='8' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='9' dispatch={dispatch}/>
          <OperationButton className="content__button" dispatch={dispatch}operation='×'/>
          <DigitButton className="content__button"digit='4' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='5' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='6' dispatch={dispatch}/>
          <OperationButton className="content__button" dispatch={dispatch}operation='-'/>
          <DigitButton className="content__button"digit='1' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='2' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='3' dispatch={dispatch}/>
          <OperationButton className="content__button" dispatch={dispatch}operation='+'/>
          <DigitButton className="content__button"digit='0' dispatch={dispatch}/>
          <DigitButton className="content__button"digit='.' dispatch={dispatch}/>
          <button className="content__button" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
        
      </main>
    </div>
  );
}

export default App;
