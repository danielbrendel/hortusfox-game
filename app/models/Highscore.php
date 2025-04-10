<?php

/*
    Asatru PHP - Model
*/

/**
 * This class extends the base model class and represents your associated table
 */ 
class Highscore extends \Asatru\Database\Model {
    /**
     * @param $playername
     * @param $score
     * @return void
     * @throws \Exception
     */
    public static function addScore($playername, $score)
    {
        try {
            static::raw('INSERT INTO `@THIS` (playername, score) VALUES(?, ?)', [
                $playername, $score
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $limit
     * @return mixed
     * @throws \Exception
     */
    public static function getList($limit = 10)
    {
        try {
            return static::raw('SELECT playername, score FROM `@THIS` ORDER BY score DESC LIMIT ' . $limit);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}