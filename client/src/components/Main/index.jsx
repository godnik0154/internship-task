import React from "react"
import styles from "./styles.module.css";
import Dashboard from "../Dashboard";
import Success from "../Success";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	let [done,setDone] = React.useState(true);

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>CompData</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
			{
				done ?
				<Dashboard setDone={setDone} />:
				<Success />
			}
		</div>
	);
};

export default Main;
