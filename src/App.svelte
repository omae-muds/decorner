<script>
	import {onMount} from 'svelte';
    import Pusher from 'pusher-js';
	
	require('dotenv').config();
	const env = process.env

    let username = 'username';
    let message = '';
    let messages = [];
    onMount(() => {
        Pusher.logToConsole = true;
        const pusher = new Pusher(env.PUSHER_KEY, {
            cluster: env.PUSHER_CLUSTER
        });
        const channel = pusher.subscribe(env.PUSHER_CHAT_CHANNEL);
        channel.bind(env.PUSHER_MESSAGE_EVENT, data => {
            messages = [...messages, data];
        });
    })
    const submit = async () => {
        await fetch('http://localhost:8000/api/message', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                message
            })
        });
        message = '';
    };
</script>

<div class="container">
    <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
        <div class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
            <input class="fs-5 fw-semibold" bind:value={username}/>
        </div>
        <div class="list-group list-group-flush border-bottom scrollarea">
            {#each messages as msg}
                <div class="list-group-item list-group-item-action py-3 lh-tight">
                    <div class="d-flex w-100 align-items-center justify-content-between">
                        <strong class="mb-1">{msg.username}</strong>
                    </div>
                    <div class="col-10 mb-1 small">{msg.message}</div>
                </div>
            {/each}
        </div>
    </div>
    <form on:submit|preventDefault={submit}>
        <input class="form-control" placeholder="Write a message" bind:value={message}/>
    </form>
</div>

<style>
    .scrollarea {
        min-height: 500px;
    }
</style>