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
            resp.whose = resp.userId === userId ? 'my' : 'other';
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

    function scrollTo() {
        document.getElementById('scrollTo').scrollIntoView({
            behavior: 'auto',
        });
    }
</script>

<div class="body container-fluid d-flex flex-column p-0">
    <div class="top-bar container-fluid shadow-lg py-2">
        <div class="input-group">
            <input
                class="form-control fw-semibold"
                form="messaging"
                placeholder="YourName"
                required
                bind:value={username}
            />
            <span class="input-group-text fw-light text-muted ps-1">
                <small>#{userId}</small>
            </span>
        </div>
    </div>

    <div class="message-view container-fluid d-flex flex-column flex-grow-1 m-0 px-4 py-4">
        {#each messages as msg}
            <div class="d-flex w-100 lh-sm mb-2 p-0" use:scrollTo>
                <div class="{msg.whose}-message position-relative shadow mw-75 px-3 py-2">
                    <div class="d-flex mb-1">
                        <span class="fw-bold text-truncate">{msg.username}</span>
                        <span class="fw-light text-muted text-truncate align-text-bottom ms-1">
                            <small>#{msg.userId}</small>
                        </span>
                    </div>
                    <div class="text-break">
                        {msg.message}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <div id="scrollTo" class="container-fluid mh-0" />

    <div class="bottom-bar container-fluid shadow-lg py-2">
        <form id="messaging" action="POST" on:submit|preventDefault={submit}>
            <div class="input-group">
                <input
                    class="form-control fw-semibold"
                    placeholder="Message"
                    required
                    bind:value={message}
                />
                <button
                    class="input-group-text"
                    type="submit"
                    style="background-color: greenyellow;"
                >
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

    .my-message {
        margin-left: auto;
        margin-right: 0;
        max-width: 75%;

        border-radius: 8px;
        background-color: greenyellow;
    }
    .my-message::after {
        position: absolute;
        top: 1rem;
        right: -10px;

        border-top: 12px solid greenyellow;
        border-right: 12px solid transparent;
        border-left: 12px solid transparent;

        content: "";
    }

    .other-message {
        margin-left: 0;
        margin-right: auto;
        max-width: 75%;

        border-radius: 8px;
        background-color: white;
    }
    .other-message::before {
        position: absolute;
        top: 1rem;
        left: -10px;

        border-top: 12px solid white;
        border-right: 12px solid transparent;
        border-left: 12px solid transparent;

        content: "";
    }
</style>
