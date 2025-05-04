<?php

/**
 * Class Utils
 */
class Utils {
    /**
     * @return string
     */
    public static function weeklyRemaining()
    {
        $now = Carbon::now();
        $nextMonday = Carbon::now()->next(Carbon::MONDAY)->startOfDay();
        $diff = $now->diff($nextMonday);
        
        if ($diff->format('%a') == 0) {
            return strval($diff->h + 1) . ' hours';
        }
        
        return $diff->format('%a days');
    }
}
