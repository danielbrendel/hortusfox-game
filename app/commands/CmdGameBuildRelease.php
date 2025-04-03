<?php 

class CmdGameBuildRelease implements Asatru\Commands\Command  {
    public function handle($args)
    {
        GameBuild::make();
    }
}