import '../../css/stats.css';
import { useGetAllTestsQuery } from './statsApiSlice';
import { useParams } from "react-router";

function Personal() {
  const params = useParams();

  const {
    data: tests = [],
    isLoading,
  } = useGetAllTestsQuery(params.userId || '');

  if(isLoading)
    return (<div>Loading...</div>);

  console.log("fetched tests: ", tests);
  
  return (
    <div className="personal--stats--container">
      {(tests.length > 0) ? (
        <>
          <h2>Individual Stats</h2>
          <div className='stats--box'>
            {tests.map((test: any, index: number) => (
              <ul key={index}>
                  <li><span>Words Per Minute: </span>{test.wordsPerMinute}</li>
                  <li><span>Accuracy: </span>{test.accuracy}</li>
                  <li><span>Date: </span>{new Date(test.date).toString()}</li>
              </ul>
            ))}
          </div>
        </>
      ) : (
        <p className='no--tests'>No tests yet!</p>
      )}
    </div>
  )
}

export default Personal;