import '../css/home.css';
import PlayGame from "../features/stats/PlayGame";
import { generateRandomParagraph } from '../utils/genRandomText';

const Home = () => {
    const text = generateRandomParagraph(15);

    return ( 
        <div className='homepage--container'>
            <PlayGame text={text}/>
        </div>
    )
}

export default Home