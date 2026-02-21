<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    public static function getSetting($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) return $default;

        switch ($setting->type) {
            case 'boolean': return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            case 'json': return json_decode($setting->value, true);
            case 'integer': return (int) $setting->value;
            default: return $setting->value;
        }
    }

    public static function setSetting($key, $value, $type = 'string', $group = 'general')
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : $value, 'type' => $type, 'group' => $group]
        );
    }
}
