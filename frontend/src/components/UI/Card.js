import './Card.css';

function Card(props) {
  return (
    <div className = {"card ".concat(props.className)}>{props.children}</div>
  )
}

export default Card