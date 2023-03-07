Oskari.registerLocalization(
{
    "lang": "ru",
    "key": "Printout",
    "value": {
        "title": "Печать",
        "flyouttitle": "Печать",
        "desc": "",
        "btnTooltip": "Печать текущего вида карты в формате PNG или PDF.",
        "BasicView": {
            "title": "Печать вида карты",
            "size": {
                "label": "Размер и направление",
                "tooltip": "Выберите размер печати и направление. Вы можете видеть обновления на предварительном просмотре изображения.",
                "options": {
                    "A4": "A4 книжная",
                    "A4_Landscape": "A4 альбомная",
                    "A3": "A3 книжная",
                    "A3_Landscape": "A3 альбомная"
                }
            },
            "preview": {
                "label": "Предпросмотр",
                "pending": "Изображение предпросмотра вскоре обновится.",
                "notes": {
                    "extent": "Проверьте масштаб области карты на предварительном изображении.",
                    "restriction": "На предварительном изображении отображается только картографическая основа."
                }
            },
            "settings": {
                "label": "Дополнительные настройки",
                "tooltip": "Выбрать настройки для вашей печати."
            },
            "format": {
                "label": "Формат файла",
                "tooltip": "Выбрать формат файла для вашей печати.",
                "options": {
                    "png": "PNG изображение",
                    "pdf": "PDF документ"
                }
            },
            "content": {
                "pageScale": {
                    "label": "Добавьте масштаб при печати карты.",
                    "tooltip": "Добавьте масштаб карты, по желанию."
                },
                "pageDate": {
                    "label": "Использовать текущую дату",
                    "tooltip": "Вы можете добавить дату при печати карты."
                }
            },
            "error": {
                "saveFailed": "Печать вида карты не удалась. Повторите попытку позже."
            },
            "scale": {
                "label": "Масштаб",
                "tooltip": "Укажите масштаб для печати",
                "map": "Используйте масштаб карты",
                "configured": "Выбрать масштаб",
                "unsupportedLayersMessage": "На распечатке не отображаются следующие слои"
            }
        },
        "StartView": {
            "info": {
                "maxLayers": "В распечатке можно использовать не более восьми слоев карты.",
                "printoutProcessingTime": "Печать вида карты может занять некоторое время при выборе нескольких слоев."
            }
        }
    }
});
