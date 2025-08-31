import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './page/Home'
import CreatePost from './page/CreatePost';
import './App.css';

function App() {
	return (
		<Router>
			<div className="app">
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/create">Create Post</Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route path="/create" element={<CreatePost />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;