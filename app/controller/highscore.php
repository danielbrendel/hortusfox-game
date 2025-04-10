<?php

/*
    Asatru PHP - Highscore Controller
*/

/**
 * This class represents your controller
 */
class HighscoreController extends BaseController {
    /**
     * Construct object
     * 
     * @return void
     */
	public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    }

    /**
	 * Handles URL: /scores/list
	 * 
	 * @param Asatru\Controller\ControllerArg $request
	 * @return Asatru\View\JsonHandler
	 */
    public function list($request)
    {
        try {
            $scores = Highscore::getList();

            return json([
                'code' => 200,
                'data' => $scores->asArray()
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'msg' => $e->getMessage()
            ]);
        }
    }

    /**
	 * Handles URL: /scores/add
	 * 
	 * @param Asatru\Controller\ControllerArg $request
	 * @return Asatru\View\JsonHandler
	 */
    public function add($request)
    {
        try {
            $playername = $request->params()->query('playername', 'Unnamed player');
            $score = $request->params()->query('score', 0);

            Highscore::addScore($playername, $score);

            return json([
                'code' => 200
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'msg' => $e->getMessage()
            ]);
        }
    }
}
