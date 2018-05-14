/**
 * @fileOverview Define the JSON of TodayRecommended page data
 */

const DATA = {
    '_id': '5af42cebd6f2c32295278900',
    '_class': 'com.tianchi.services.content.domain.Layout',
    'navBarId': 'todayRecommend',
    'recommendLayoutList': [
        {
            'title': '电视剧二级分类',
            'renderType': 'PROGRAMME_TYPE',
            'layoutTemplate': 'LT_2_6',
            'recommendLayoutItemList': [
                {
                    'itemType': 'PROGRAMME_TYPE',
                    'targetId': 'programmeTypeId',
                    'programmeTypeName': '惊悚剧'
                },
                {
                    'itemType': 'PROGRAMME_TYPE',
                    'targetId': 'programmeTypeId',
                    'programmeTypeName': '爱情剧'
                },
                {
                    'itemType': 'PROGRAMME_TYPE',
                    'targetId': 'programmeTypeId',
                    'programmeTypeName': '悬疑剧'
                }
            ]
        },
        {
            'title': '推荐的视频和专题',
            'renderType': 'RECOMMEND_ITEM',
            'layoutTemplate': 'LT_2_6',
            'recommendLayoutItemList': [
                {
                    'itemType': 'PROGRAMME',
                    'targetId': 'programmeId',
                    'posterImg': {
                        'uri': '1.jpg'
                    },
                    'cornerMark': {
                        'leftTop': {
                            'markType': 'EPISODES_NUMBER'
                        },
                        'rightTop': {
                            'markType': 'SCORE'
                        },
                        'rightBottom': {
                            'markType': 'CUSTOM'
                        },
                        'leftBottom': {
                            'markType': 'COPYRIGHT_RESERVER'
                        }
                    }
                }
            ]
        }
    ],
    'subjectLayoutList': [
        {
            '_id': null,
            'subjectId': 'subjectId',
            'title': '热门视频推荐',
            'subjectCategory': 'PROGRAMME',
            'layoutTemplate': 'LT_2_6',
            'subjectLayoutItemList': [
                {
                    'targetId': 'programmeId1',
                    'posterImg': {
                        'uri': 'programme.jpg'
                    },
                    'cornerMar': {
                        'leftTop': {
                            'markType': 'CUSTOM'
                        },
                        'rightTop': {
                            'markType': 'COPYRIGHT_RESERVER'
                        },
                        'rightBottom': {
                            'markType': 'EPISODES_NUMBER'
                        },
                        'leftBottom': {
                            'markType': 'SCORE'
                        }
                    }
                },
                {
                    'targetId': 'programmeId2',
                    'posterImg': {
                        'uri': 'programme.jpg'
                    },
                    'cornerMar': {
                        'leftTop': {
                            'markType': 'CUSTOM'
                        },
                        'rightTop': {
                            'markType': 'COPYRIGHT_RESERVER'
                        },
                        'rightBottom': {
                            'markType': 'EPISODES_NUMBER'
                        },
                        'leftBottom': {
                            'markType': 'SCORE'
                        }
                    }
                }
            ]
        }
    ]
};

export default DATA;
