<?php

/**
 * Class GameBuild
 */
class GameBuild {
    /**
     * @param $debug
     * @return void
     */
    public static function make($debug = false)
    {
        $build_type = ($debug) ? 'Debug' : 'Release';
        echo "Building game (Build type: {$build_type})...\n";

        $_SERVER['SERVER_PORT'] = 80;
        $_SERVER['SERVER_NAME'] = 'localhost';
        $_ENV['APP_DEBUG'] = $debug;

        echo "Creating folders...\n";
        
        if (!is_dir(public_path() . '/build')) {
            mkdir(public_path() . '/build');
        }

        if (!is_dir(public_path() . '/build/js')) {
            mkdir(public_path() . '/build/js');
        }

        if (!is_dir(public_path() . '/build/game')) {
            mkdir(public_path() . '/build/game');
        }

        echo "Generating views...\n";

        $view = view('layout', ['content', 'index'], [])->out(true);
        $view = str_replace('/play', '/play.html', $view);
        $view = str_replace('http://' . $_SERVER['SERVER_NAME'] . '/', '', $view);
        file_put_contents(public_path() . '/build/index.html', $view);

        $view = view('layout', ['content', 'game'], [])->out(true);
        $view = str_replace('http://' . $_SERVER['SERVER_NAME'] . '/', '', $view);
        $view = str_replace('href=""', 'href="index.html"', $view);
        file_put_contents(public_path() . '/build/play.html', $view);

        echo "Copying assets...\n";

        copy(public_path() . '/js/fontawesome.js', public_path() . '/build/js/fontawesome.js');
        copy(public_path() . '/js/app.js', public_path() . '/build/js/app.js');
        copy(public_path() . '/game/game.js', public_path() . '/build/game/game.js');

        system('xcopy "' . public_path() . '/game/assets" "' . public_path() . '/build/game/assets/" /E /V /I /Y');

        echo "Fixing path...\n";

        $game = file_get_contents(public_path() . '/build/game/game.js');
        $game = str_replace('this.load.setBaseURL(window.location.origin);', '', $game);
        file_put_contents(public_path() . '/build/game/game.js', $game);

        if ($debug) {
            echo "Adding build info...\n";

            $build_info = [
                'type' => $build_type,
                'time' => date('Y-m-d H:i:s'),
                'platform' => PHP_OS,
                'php' => PHP_VERSION
            ];

            file_put_contents(public_path() . '/build/version.json', json_encode($build_info));
        }

        echo "Packaging...\n";

        $package_name = 'game_build_' . time() . '.zip';
        $root_path = public_path() . '/build';

        $zip = new ZipArchive();
        $zip->open(public_path() . '/' . $package_name, ZIPARCHIVE::CREATE | ZipArchive::OVERWRITE);

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root_path),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($root_path) + 1);

                $zip->addFile($filePath, $relativePath);
            }
        }

        $zip->close();

        copy(public_path() . '/' . $package_name, public_path() . '/builds/' . $package_name);

        echo "Cleaning up...\n";

        system('rmdir /S /Q "' . $root_path . '"');
        unlink(public_path() . '/' . $package_name);

        echo "Done!\n";
    }
}
