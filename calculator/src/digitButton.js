import { ACTIONS } from "./App.js";

export default function digitButton({ dispatch,digit }) {
    return <button className="content__button" onClick={()=> dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{ digit }</button>
}