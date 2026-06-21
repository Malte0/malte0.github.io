<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const views = [
	{ label: "Login", path: "/login" },
	{ label: "Exercise Input", path: "/input" },
	{ label: "Raw Data", path: "/rawData" },
	{ label: "Workouts", path: "/workouts" },
];

function goTo(path: string) {
	router.push(path);
}
</script>

<template>
	<main class="home">
		<h1>Home</h1>
		<div class="button-grid">
			<button v-for="view in views" :key="view.path" type="button" @click="goTo(view.path)">
				{{ view.label }}
			</button>
		</div>
	</main>
</template>

<style scoped>
.home {
	min-height: 100vh;
	display: grid;
	place-content: center;
	gap: 1.5rem;
	padding: 2rem;
}

.home h1 {
	margin: 0;
	text-align: center;
}

.button-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.9rem;
	width: min(720px, 100%);
}

button {
	padding: 0.9rem 1.1rem;
	border: 1px solid #d0d7de;
	border-radius: 12px;
	background: #f6f8fa;
	color: #24292f;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.12s ease, background-color 0.15s ease, border-color 0.15s ease;
}

button:hover {
	background: #eef1f4;
	border-color: #8c959f;
	transform: translateY(-1px);
}

button:active {
	transform: translateY(0);
	background: #eaeef2;
}
</style>
