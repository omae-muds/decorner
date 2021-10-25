<script>
    import {onMount} from 'svelte';
    import Pusher from 'pusher-js';
import { get_all_dirty_from_scope } from 'svelte/internal';

    const userId = Math.random().toString(16).substring(2, 10)
            + Math.random().toString(16).substring(2, 10);
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
                userId,
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
                <div class='bar'>
                    <input class="fs-5 fw-semibold" id ='user-area' bind:value={username}/>
                </div>
            </div>

            <div class="list-group list-group-flush border-bottom scrollarea">
                {#each messages as msg}
                    <div class="list-group-item list-group-item-action py-3 lh-tight">

                        {#if userId==userId}
                            <div class="my-message">
                                <div class="d-flex w-100 align-items-center justify-content-between">
                                    <strong class="mb-1">{msg.username}</strong>
                                </div>
                                <div class="col-10 mb-1 small">{msg.message}</div>
                            </div>
                          {:else}
                            <div class="0ther-message">
                                <div class="d-flex w-100 align-items-center justify-content-between">
                                    <strong class="mb-1">{msg.username}</strong>
                                </div>
                                <div class="col-10 mb-1 small">{msg.message}</div>
                            </div>
                        {/if}

                        <!-- <div class="message">
                            <div class="d-flex w-100 align-items-center justify-content-between">
                                <strong class="mb-1">{msg.username}</strong>
                            </div>
                            <div class="col-10 mb-1 small">{msg.message}</div>
                        </div> -->

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
                <form on:submit|preventDefault={submit}>
                    <input id="send-area" type="submit" formmethod="POST" value="Send">
                </form>
            </div>


        </div>
    </div>
</div>

<style>
    body{
        background-color:rgb(100,150,195);
    }
    
    .body {
        position: absolute;
        width: 100%;
        /* background-color:rgb(100,150,195); */
        /* background-color: ivory; */
        height: 100%;
        /* z-index: -2; */
}
    .bar{
        /* background-color:red; */
        background-color:rgb(100,150,195);
        /* position:fixed; */
        top:0;
        width:100%;
        box-sizing:border-box;
        height:6ex;
        /* margin-right: 1em; */
        z-index:1;
        position: fixed;
}

    #user-area{
        border-radius: 6px;/*角の丸み*/
        /* position: fixed; */
        /* background-color:rgb(100,150,195); */
    }
    .container {
        background-color:rgb(100,150,195);
        height: 100%;
        width: 100%;
        /* left: 0;
        right: 0; */
    }

    .scrollarea {
        /* position:relative; */
        background-color:rgb(100,150,195);
        /* z-index: -1; */
        /* overflow-y: scroll; スクロールを効かせつつ、メッセージがタイムラインの外に出ないようにする */
        /* margin-bottom: 6ex; */
        /* margin-top:6ex; */
        padding-top: 6ex;
        padding-bottom: 6ex;

        /* margin: 6ex; */
        /* border-top: 6ex; */
        /* max-height: 100%-12ex; */
        /* margin:6ex 0 6ex 0; */
        /* min-height: 100%; */
    }
    .my-message:before {  /* ふきだしの右三角を描画 */
        float:right;
        content: '';
        position:absolute;
        z-index: 0;
        top:8px;
        right:-20px;
        border: 12px solid transparent;
        border-left:12px solid greenyellow;
}
    .my-message { /* ふきだしの本体 */
        float:right;
        display:inline-block;
        position:relative;
        z-index: 0;
        background-color:greenyellow;
        border-radius:10px;
        padding:8px;
        margin:0 10 10px 0px;
        max-width: 75vw;
}

    .other-message:before {  /* ふきだしの左三角を描画 */
        content: '';
        position:absolute;
        z-index: 0;
        top:8px;
        left:-20px;
        border: 12px solid transparent;
        border-right:12px solid white;
}
    .other-message { /* ふきだしの本体 */
        display:inline-block;
        position:relative;
        z-index: 0;
        background-color:white;
        border-radius:10px;
        padding:8px;
        margin:0 0 10px 10px;
        max-width: 75vw;
}


    .message-area {
        /* background-color:rgb(100,150,195); */
        height: 6ex;
        width: 100%;
        display: flex;
        bottom: 0; /*下に固定*/
        position: fixed;
        z-index: 1;
        /* max-height: 100vh; */
        /* white-space: normal; */
}
    .message-area-text {
        background-color:rgb(100,150,195);
        width: 90%;
        word-wrap: break-word;
        /* overflow-y: scroll;*/
        max-height: 100vh;
        white-space: normal;
}
    .message-area-send {
        background-color:rgb(100,150,195);
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
        font-weight: bold;
        border: solid 3px #6091d3;/*線*/
        border-radius: 6px;/*角の丸み*/
        box-sizing: border-box;
}
    #text-area {
        width: 100%;
        height: 100%;
        background: ghostwhite;
        font-weight: bold;
        border: solid 3px #6091d3;/*線*/
        border-radius: 6px;/*角の丸み*/
        box-sizing: border-box;
}
</style>