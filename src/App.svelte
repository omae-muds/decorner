<script>
    import {onMount} from 'svelte';
    import Pusher from 'pusher-js';
import { get_all_dirty_from_scope } from 'svelte/internal';

    let username = 'username';
    let message = '';
    let messages = [];
    onMount(() => {
        Pusher.logToConsole = true;
        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER
        });
        const channel = pusher.subscribe(PUSHER_CHAT_CHANNEL);
        channel.bind(PUSHER_MESSAGE_EVENT, data => {
            messages = [...messages, data];
        });
    });
    const submit = async () => {
        await fetch('https://decorner.vercel.app/api/message', {
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
    <div class="message-area">
        <div class="message-area-text">
            <form on:submit|preventDefault={submit}>
                <input id="text-area" placeholder="Write a message" bind:value={message}/>
            </form>
        </div>
        <div class="message-area-send">
            <form>
                <input id="send-area" type="submit" value="Send">
            </form>
        </div>
    </div>
</div>

<style>

    .message-area {
        display: flex;
}
    .message-area-text {
        width: 90%;
}
    .message-area-send {
        width: 10%;
}

    #send-area {
        width: 100%;
        height: 100%;
        background:greenyellow;
        font-size: 1.0rem;
        font-weight: bold;
        /* padding: 0.5em 1em; */
        /* margin: 2em 0; */
        border: solid 3px #6091d3;/*線*/
        border-radius: 6px;/*角の丸み*/
        box-sizing: border-box;
}
    #text-area {
        width: 100%;
        height: 100%;
        background: ghostwhite;
        font-size: 1.0rem;
        font-weight: bold;
        /* padding: 0.5em 1em; */
        /* margin: 2em 0; */
        border: solid 3px #6091d3;/*線*/
        border-radius: 6px;/*角の丸み*/
        box-sizing: border-box;
}


    .scrollarea {
        overflow: auto; /* スクロールを効かせつつ、メッセージがタイムラインの外に出ないようにする */
        min-height: 500px;
        /* height:100%;テキストエリアが下に張り付く様にする */
    }
</style>