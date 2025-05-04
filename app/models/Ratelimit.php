<?php

/**
 * Class Ratelimit
 */ 
class Ratelimit extends \Asatru\Database\Model {
    /**
     * @return void
     * @throws \Exception
     */
    public static function interfere()
    {
        try {
            $token = md5($_SERVER['REMOTE_ADDR']);
            $delay = env('APP_RATELIMIT', 100);

            $last = static::raw('SELECT * FROM `@THIS` WHERE token = ? LIMIT 1', [$token])->first();
            if (!$last) {
                static::raw('INSERT INTO `@THIS` (token) VALUES(?)', [$token]);
                return;
            }

            $timestamp = strtotime($last->get('updated_at'));

            if ($timestamp + $delay >= time()) {
                throw new \Exception('Ratelimit interfered');
            }

            static::raw('UPDATE `@THIS` SET updated_at = CURRENT_TIMESTAMP WHERE token = ?', [$token]);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}