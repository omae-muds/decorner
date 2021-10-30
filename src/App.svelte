<script>
    import { onMount } from 'svelte';
    import Pusher from 'pusher-js';

    const userId =
        Math.random().toString(16).substring(2, 10) +
        Math.random().toString(16).substring(2, 10);
    let username = 'username';

    let message = '';
    let messages = [];

    onMount(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
        });
        const channel = pusher.subscribe(PUSHER_CHAT_CHANNEL);

        channel.bind(PUSHER_MESSAGE_EVENT, (resp) => {
            // resp.whose = resp.userId === userId ? 'my' : 'other'
            resp.whose = Math.random() < 0.5 ? 'my' : 'other'
            messages = [...messages, resp];
        });
    });

    const submit = async () => {
        await fetch('https://decorner.vercel.app/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                username,
                message,
            }),
        });

        message = '';
    };
</script>

<div class="body container-fluid d-flex flex-column p-0">
    <div class="top-bar container-fluid shadow-lg py-2">
        <div class="input-group">
            <input
                class="form-control fw-semibold"
                form="messaging"
                placeholder="YourName"
                bind:value={username}
            />
            <span class="input-group-text fw-light text-muted ps-1"
                ><small>#{userId}</small></span
            >
        </div>
    </div>

    <div class="message-view container-fluid d-flex flex-grow-1 m-0 py-4">
        <div class="list-group list-group-flush border-bottom">
            {#each messages as msg}
                <div
                    class="list-group-item list-group-item-action lh-sm py-3"
                >
                    <div class="{msg.whose}-message">
                        <div class="d-flex mx-2 mb-1">
                            <span class="fw-bold text-truncate">{msg.username}</span>
                            <span class="fw-light text-muted text-truncate align-text-bottom ms-1">
                                <small>#{msg.userId}</small>
                            </span>
                        </div>
                        <div class="col-10 mb-1 text-break">
                            {msg.message}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="bottom-bar container-fluid shadow-lg py-2">
        <form id="messaging" action="POST" on:submit|preventDefault={submit}>
            <div class="input-group">
                <input
                    class="form-control fw-semibold"
                    placeholder="Message"
                    bind:value={message}
                />
                <button class="input-group-text bg-greenyellow" type="submit">
                    <ion-icon name="send-outline" />
                    <span class="ms-2 fw-light">Send</span>
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    :global(body) {
        background-color: rgb(100, 150, 195) !important;
        padding: 0;
    }

    .body {
        min-height: 100vh;
    }

    .top-bar {
        position: sticky;
        top: 0;
        z-index: 1000;

        border-radius: 0 0 8px 8px;
        background-color: white;
    }

    .bottom-bar {
        position: sticky;
        bottom: 0;

        border-radius: 8px 8px 0 0;
        background-color: white;
    }

    .message-view {
        margin: 0;
        z-index: 0;
    }

    .my-message:before {
        /* ふきだしの右三角を描画 */
        float: right;
        content: "";
        position: absolute;
        z-index: 0;
        top: 8px;
        right: -20px;
        border: 12px solid transparent;
        border-left: 12px solid greenyellow;
    }
    .my-message {
        /* ふきだしの本体 */
        float: right;
        display: inline-block;
        position: relative;
        z-index: 0;
        background-color: greenyellow;
        border-radius: 10px;
        padding: 8px;
        margin: 0 10 10px 0px;
        max-width: 75vw;
    }

    .other-message:before {
        /* ふきだしの左三角を描画 */
        content: "";
        position: absolute;
        z-index: 0;
        top: 8px;
        left: -20px;
        border: 12px solid transparent;
        border-right: 12px solid white;
    }
    .other-message {
        /* ふきだしの本体 */
        display: inline-block;
        position: relative;
        z-index: 0;
        background-color: white;
        border-radius: 10px;
        padding: 8px;
        margin: 0 0 10px 10px;
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
        background-color: rgb(100, 150, 195);
        width: 90%;
        word-wrap: break-word;
        /* overflow-y: scroll;*/
        max-height: 100vh;
        white-space: normal;
    }
    .message-area-send {
        background-color: rgb(100, 150, 195);
        width: 10%;
        margin-right: 1em;
        /* position: fixed; */
        /* position: absolute; */
        /* bottom: 0; 下に固定 */
        /* right: auto; */
    }

    .bg-greenyellow {
        background-color: greenyellow;
    }
</style>
