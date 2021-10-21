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
<div class="body">
    <div class="container">
        <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
            <div class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                <input class="fs-5 fw-semibold" id ='user-area' bind:value={username}/>
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
</div>

<style>
    .body {
        height: 100%;
}
    #user-area{
        border-radius: 6px;/*角の丸み*/
        position: fixed;
    }
    .container {
        background-color:rgb(100,150,195);
        height: 100%;
        width: 100%;
        /* left: 0;
        right: 0; */
    }

    .scrollarea {
        background-color:rgb(100,150,195);
        overflow-y: scroll; /* スクロールを効かせつつ、メッセージがタイムラインの外に出ないようにする */
        min-height: 100%;
    }

    .message-area {
        width: 100%;
        display: flex;
        bottom: 0; /*下に固定*/
        /* padding-bottom: 0%; */
        /* position: absolute; */
        position: fixed;
        max-height: 100vh;
        /* right: auto;
        left: auto; */
}
    .message-area-text {
        width: 90%;
        word-wrap: break-word;
        /* position: fixed; */
        /* position: absolute; */
        /* bottom: 0; 下に固定 */
        /* overflow-y: scroll;*/
        max-height: 100vh;
        /* right: auto; */
}
    .message-area-send {
        width: 10%;
        margin-right: 1em;
        /* position: fixed; */
        /* position: absolute; */
        /* bottom: 0; 下に固定 */
        /* right: auto; */
}
    #send-area {
        width: 100%;
        height: 100%;
        background:greenyellow;
        /* font-size: 1.0rem; */
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
        /* font-size: 1.0rem; */
        font-weight: bold;
        /* padding: 0.5em 1em; */
        /* margin: 2em 0; */
        border: solid 3px #6091d3;/*線*/
        border-radius: 6px;/*角の丸み*/
        box-sizing: border-box;
}
</style>