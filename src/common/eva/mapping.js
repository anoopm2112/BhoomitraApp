import { dimensionUtils } from '../utils';

const { convertHeight, convertWidth } = dimensionUtils;

export default {
    "strict": {
        "text-font-family": "Roboto-Regular",
        "text-heading-1-font-size": convertHeight(40),
        "text-heading-1-font-weight": "400",
        "text-heading-1-font-family": "Roboto-Regular",
        "text-heading-2-font-size": convertHeight(30),
        "text-heading-2-font-weight": "400",
        "text-heading-2-font-family": "Roboto-Regular",
        "text-heading-3-font-size": convertHeight(20),
        "text-heading-3-font-weight": "400",
        "text-heading-3-font-family": "Roboto-Regular",
        "text-heading-4-font-size": convertHeight(16),
        "text-heading-4-font-weight": "900",
        "text-heading-4-font-family": "Roboto-Black",
        "text-heading-5-font-size": convertHeight(14),
        "text-heading-5-font-weight": "400",
        "text-heading-5-font-family": "Roboto-Regular",
        "text-subtitle-1-font-size": convertHeight(14),
        "text-subtitle-1-font-weight": "500",
        "text-subtitle-1-font-family": "Roboto-Medium",
        "text-subtitle-2-font-size": convertHeight(14),
        "text-subtitle-2-font-weight": "700",
        "text-subtitle-2-font-family": "Roboto-Bold",
        "text-paragraph-1-font-size": convertHeight(14),
        "text-paragraph-1-font-weight": "400",
        "text-paragraph-1-font-family": "Roboto-Regular",
        "text-paragraph-2-font-size": convertHeight(14),
        "text-paragraph-2-font-weight": "400",
        "text-paragraph-2-font-family": "Roboto-Regular",
        "text-caption-1-font-size": convertHeight(12),
        "text-caption-1-font-weight": "400",
        "text-caption-1-font-family": "Roboto-Regular",
        "text-caption-2-font-size": convertHeight(10),
        "text-caption-2-font-weight": "400",
        "text-caption-2-font-family": "Roboto-Regular",
        "text-label-font-size": convertHeight(14),
        "text-label-font-weight": "400",
        "text-label-font-family": "Roboto-Regular",
        "size-tiny": convertWidth(24),
        "size-small": convertWidth(32),
        "size-medium": convertWidth(40),
        "size-large": convertWidth(48),
        "size-giant": convertWidth(56),
        "border-radius": convertWidth(5),
        "border-width": convertWidth(1)
    },
    "components": {
        "Layout": {
            "meta": {
                "variantGroups": {
                    "level": {
                        "1": {
                            "default": false
                        },
                        "2": {
                            "default": true
                        },
                        "6": {
                            "default": false
                        },
                        "10": {
                            "default": false
                        }
                    }
                }
            },
            "appearances": {
                "default": {
                    "variantGroups": {
                        "level": {
                            "6": {
                                "backgroundColor": "background-basic-color-6"
                            },
                            "10": {
                                "backgroundColor": "background-basic-color-10"
                            }
                        }
                    }
                }
            }
        },
        "Radio": {
            "meta": {
                "variantGroups": {
                    "status": {
                        "white": {
                            "default": false
                        },
                        "black": {
                            "default": false
                        },
                    }
                },
            },
            "appearances": {
                "default": {
                    "mapping": {
                        "width": convertHeight(18),
                        "height": convertHeight(18),
                        "borderRadius": convertWidth(10),
                        "iconWidth": convertHeight(9),
                        "iconHeight": convertHeight(9),
                        "iconBorderRadius": convertWidth(6),
                        "outlineWidth": convertHeight(32),
                        "outlineHeight": convertHeight(32),
                        "outlineBorderRadius": convertWidth(16),
                        "textMarginHorizontal": convertWidth(50)
                    },
                    "variantGroups": {
                        "status": {
                            "white": {
                                "backgroundColor": "color-basic-600",
                                "state": {
                                    "checked": {
                                        "borderColor": "color-basic-100",
                                        "iconTintColor": "color-basic-100"
                                    },
                                    "active": {
                                        "borderColor": "color-basic-100"
                                    },
                                    "checked.active": {
                                        "borderColor": "color-basic-100",
                                        "iconTintColor": "color-basic-100"
                                    }
                                }
                            },
                            "black": {
                                "borderColor": "text-black-color",
                                "state": {
                                    "checked": {
                                        "borderColor": "text-black-color",
                                        "iconTintColor": "text-black-color"
                                    },
                                    "active": {
                                        "borderColor": "text-black-color"
                                    },
                                    "checked.active": {
                                        "borderColor": "text-black-color",
                                        "iconTintColor": "text-black-color"
                                    }
                                }
                            },
                            "basic": {
                                "borderColor": "text-placeholder-color",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-primary-500",
                                "state": {
                                    "checked": {
                                        "borderColor": "color-basic-600",
                                        "iconTintColor": "color-basic-600"
                                    },
                                    "focused": {
                                        "borderColor": "color-basic-600",
                                        "backgroundColor": "color-basic-600",
                                        "outlineBackgroundColor": "color-basic-600"
                                    },
                                    "active": {
                                        "borderColor": "color-basic-600",
                                        "outlineBackgroundColor": "color-basic-transparent-600"
                                    },
                                }
                            },
                            "success": {
                                "borderColor": "text-placeholder-color",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-primary-500",
                                "state": {
                                    "checked": {
                                        "borderColor": "color-success-500",
                                        "iconTintColor": "color-success-500"
                                    },
                                    "focused": {
                                        "borderColor": "color-success-500",
                                        "backgroundColor": "color-success-500",
                                        "outlineBackgroundColor": "color-success-500"
                                    },
                                    "active": {
                                        "borderColor": "color-success-500",
                                        "outlineBackgroundColor": "color-success-transparent-600"
                                    },
                                }
                            }
                        }
                    }
                }
            }
        },
        "CheckBox": {
            "appearances": {
                "default": {
                    "mapping": {
                        "width": convertHeight(18),
                        "height": convertHeight(18),
                        "borderRadius": convertWidth(3),
                        "outlineWidth": convertHeight(32),
                        "outlineHeight": convertHeight(32),
                        "outlineBorderRadius": convertWidth(6),
                        "textMarginHorizontal": convertWidth(12),
                        "iconWidth": convertHeight(12),
                        "iconHeight": convertHeight(12)
                    },
                    "variantGroups": {
                        "status": {
                            "basic": {
                                "borderColor": "text-placeholder-color",
                                "backgroundColor": "color-basic-100",
                                "state": {
                                    "checked": {
                                        "borderColor": "color-basic-default-border",
                                        "backgroundColor": "color-basic-default"
                                    }
                                }
                            },
                            "success": {
                                "borderColor": "text-placeholder-color",
                                "backgroundColor": "color-basic-100"
                            }
                        }
                    }
                }
            }
        },
        "Button": {
            "appearances": {
                "filled": {
                    "mapping": {
                        "iconMarginHorizontal": convertWidth(4),
                        "textFontFamily": "text-label-font-family",
                        "textFontSize": "text-label-font-size",
                        "textFontWeight": "text-label-font-weight"
                    },
                    "variantGroups": {
                        "status": {
                            "basic": {
                                "textColor": "color-basic-100",
                            },
                            "success": {
                                "textColor": "color-basic-100",
                            }
                        },
                        "size": {
                            "tiny": {
                                "paddingHorizontal": convertWidth(6),
                                "paddingVertical": convertHeight(6),
                                "textMarginHorizontal": convertWidth(6),
                                "textFontSize": convertHeight(10),
                                "iconWidth": convertWidth(12),
                                "iconHeight": convertWidth(12),
                                "iconMarginHorizontal": convertWidth(6)
                            },
                            "small": {
                                "paddingHorizontal": convertWidth(8),
                                "paddingVertical": convertHeight(8),
                                "textMarginHorizontal": convertWidth(8),
                                "textFontSize": convertHeight(12),
                                "iconWidth": convertWidth(16),
                                "iconHeight": convertWidth(16),
                                "iconMarginHorizontal": convertWidth(8)
                            },
                            "medium": {
                                "paddingHorizontal": convertWidth(10),
                                "paddingVertical": convertHeight(12),
                                "textMarginHorizontal": convertWidth(10),
                                "textFontSize": convertHeight(14),
                                "iconWidth": convertWidth(20),
                                "iconHeight": convertWidth(20),
                                "iconMarginHorizontal": convertWidth(10)
                            },
                            "large": {
                                "paddingHorizontal": convertWidth(10),
                                "paddingVertical": convertHeight(14),
                                "textMarginHorizontal": convertWidth(10),
                                "textFontSize": convertHeight(16),
                                "iconWidth": convertWidth(24),
                                "iconHeight": convertWidth(24),
                                "iconMarginHorizontal": convertWidth(10)
                            },
                            "giant": {
                                "paddingHorizontal": convertWidth(12),
                                "paddingVertical": convertHeight(16),
                                "textMarginHorizontal": convertWidth(12),
                                "textFontSize": convertHeight(18),
                                "iconWidth": convertWidth(24),
                                "iconHeight": convertWidth(24),
                                "iconMarginHorizontal": convertWidth(12)
                            }
                        }
                    }
                },
                "outline": {
                    "variantGroups": {
                        "status": {
                            "basic": {
                                "borderColor": "color-basic-default-border",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-basic-600",
                                "state": {
                                    "hover": {
                                        "backgroundColor": "color-basic-100",
                                        "textColor": "color-basic-default",
                                        "iconTintColor": "color-basic-default"
                                    },
                                    "focused": {
                                        "backgroundColor": "color-basic-100",
                                        "textColor": "color-basic-default",
                                        "iconTintColor": "color-basic-default"
                                    },
                                    "active": {
                                        "backgroundColor": "color-basic-100",
                                        "textColor": "color-basic-default",
                                        "iconTintColor": "color-basic-default"
                                    },
                                }
                            },
                            "primary": {
                                "borderColor": "color-primary-default-border",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-primary-500",
                                "state": {
                                    "hover": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "focused": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "active": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                }
                            },
                            "success": {
                                "borderColor": "color-success-default-border",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-success-500",
                                "state": {
                                    "hover": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "focused": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "active": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                }
                            },
                            "danger": {
                                "borderColor": "color-danger-default-border",
                                "backgroundColor": "color-basic-100",
                                "textColor": "color-danger-500",
                                "state": {
                                    "hover": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "focused": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                    "active": {
                                        "backgroundColor": "color-basic-100"
                                    },
                                }
                            },
                        },
                    },
                }
            }
        },
        "Input": {
            "appearances": {
                "default": {
                    "mapping": {
                        "paddingHorizontal": convertWidth(8),
                        "textMarginHorizontal": convertWidth(8),
                        "iconWidth": convertWidth(24),
                        "iconHeight": convertWidth(24),
                        "iconMarginHorizontal": convertWidth(8),
                        "labelMarginBottom": convertHeight(4),
                        "captionMarginTop": convertHeight(4),
                        "captionIconWidth": convertWidth(10),
                        "captionIconHeight": convertHeight(10),
                        "captionIconMarginRight": convertWidth(8)
                    },
                    "variantGroups": {
                        "size": {
                            "small": {
                                "paddingVertical": convertHeight(3)
                            },
                            "medium": {
                                "textFontFamily": "text-subtitle-1-font-family",
                                "textFontSize": "text-subtitle-1-font-size",
                                "textFontWeight": "text-subtitle-1-font-weight",
                                "paddingVertical": convertHeight(7)
                            },
                            "large": {
                                "paddingVertical": convertHeight(11)
                            }
                        }
                    }
                }
            }
        },
        "MenuItem": {
            "appearances": {
                "default": {
                    "mapping": {
                        "paddingHorizontal": convertWidth(8),
                        "paddingVertical": convertHeight(12),
                        "titleMarginHorizontal": convertWidth(8),
                        "iconWidth": convertHeight(20),
                        "iconHeight": convertHeight(20),
                        "iconMarginHorizontal": convertWidth(8),
                        "state": {
                            "selected": {
                                "backgroundColor": "color-primary-transparent-default",
                                "indicatorWidth": 0,
                                "indicatorBackgroundColor": "color-success-default",
                                "titleColor": "text-primary-color",
                                "iconTintColor": "text-primary-color"
                            }
                        }
                    }
                },
                "grouped": {
                    "mapping": {
                        "paddingLeft": convertWidth(16)
                    }
                }
            }
        },
        "Toggle": {
            "appearances": {
                "default": {
                    "mapping": {
                        "width": convertHeight(42),
                        "height": convertHeight(25),
                        "thumbWidth": convertHeight(20),
                        "thumbHeight": convertHeight(20),
                    },
                }
            }
        },
    }
}