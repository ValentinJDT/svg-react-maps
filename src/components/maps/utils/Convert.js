import List from "./TempList";

const Convert = () => {

  const obj = {
    paths: List.map(value => {
      return {
        id: value.props.id,
        name: value.props.title,
        d: value.props.d
      }
    })
  };

  return (
    <pre>
      {JSON.stringify(obj)}
    </pre>
  )
}

export default Convert;
