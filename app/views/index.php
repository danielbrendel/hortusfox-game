<div class="startmenu" style="background-image: url('{{ asset('game/assets/sprites/sky.png') }}');">
    <div class="startmenu-overlay">
        <div class="startmenu-inner">
            <div class="startmenu-title">
                <h1>Bouncy Garden Fox</h1>

                <h2>A free jump & run game</h2>
            </div>

            <div class="startmenu-screenshot">
                <img src="{{ asset('img/screenshot-game.png') }}" alt="screenshot"/>
            </div>

            <div class="startmenu-actions">
                <a class="button button-start" href="{{ url('/play') }}">Start game</a>
                <a class="button button-scores" href="{{ url('/highscore') }}">Highscore</a>
            </div>

            <div class="startmenu-info">
                This game is powered by <a href="{{ env('LINK_HOMEPAGE') }}">HortusFox</a> - the selfhosted, collaborative management & tracking app for your indoor and outdoor plants.
            </div>

            <div class="startmenu-links">
                @if (env('LINK_GITHUB'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_GITHUB') }}" target="_blank"><i class="fab fa-github"></i></a>
                </div>
                @endif

                @if (env('LINK_DISCORD'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_DISCORD') }}" target="_blank"><i class="fab fa-discord"></i></a>
                </div>
                @endif

                @if (env('LINK_YOUTUBE'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_YOUTUBE') }}" target="_blank"><i class="fab fa-youtube"></i></a>
                </div>
                @endif

                @if (env('LINK_FOSSVIDEO'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_FOSSVIDEO') }}" target="_blank"><i class="fas fa-video"></i></a>
                </div>
                @endif

                @if (env('LINK_MASTODON'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_MASTODON') }}" target="_blank"><i class="fab fa-mastodon"></i></a>
                </div>
                @endif

                @if (env('LINK_PIXELFED'))
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_PIXELFED') }}" target="_blank"><i class="fas fa-camera"></i></a>
                </div>
                @endif
            </div>

            @if (env('APP_DEBUG'))
                <div class="startmenu-build-type">Build type: Debug</div>
            @endif
        </div>
    </div>
</div>

<script>
    if ((screen.orientation) && (screen.orientation.lock)) {
        screen.orientation.lock('portrait').catch((err) => {
            console.error('Failed to lock orientation to portrait: ', err);
        });
    }
</script>