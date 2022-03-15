import React, { useEffect, useState, useRef, createRef } from 'react';
import { StyleSheet, View, Keyboard, BackHandler } from 'react-native';
import _ from 'lodash';
import { createAnimatableComponent, View as AnimatedView } from 'react-native-animatable';
import { components, I18n, locks } from '../../../common';
import { dimensionUtils, asyncutils, toastUtils } from "../../../common/utils";
import { useTheme } from '@ui-kitten/components';
import getElements from '../utils/fragmentUtil';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
import { useIsFocused } from '@react-navigation/native';
import { LANGUAGESI18N } from '../../../common/constants';

const { dfgLock } = locks;
const { waitUntil } = asyncutils;
const { infoToast, hideToast } = toastUtils;
const { SafeAreaView, Header, Content, Text, Modal, Card, Button, Icon } = components;
const { convertHeight, convertWidth } = dimensionUtils;

const AnimatedCard = createAnimatableComponent(Card);

export default DynamicFormView = (props) => {
    const { animationData, language: { locale = {} }, tourData: { appTour } = {} } = props;
    let [appTourTargets, addAppTourTargets] = useState([]);
    const locales = _.find(LANGUAGESI18N, function (o) { return o.locale === locale; });
    const [finish, setFinish] = useState(true);
    const [showNextButton, setShowNextButton] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [nextButtonLabel, setNextButtonLabel] = useState(I18n.t('next'));
    const showButtonsView = (ref) => {
        if (animationData) {
            ref.current.fadeInUp();
        }
    }
    const hideButtonsView = (ref, setKeyboardVisible) => {
        setTimeout(() => { setKeyboardVisible(true); }, 200);
        if (animationData) {
            ref.current.fadeOutDown();
        }
    }
    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        previousButton,
        processConnectedQuestions,
        clearConnectedQuestionsToShow,
        setDataSource,
        setScanQrCodeAppTour
    } = props;
    const {
        next,
        prev,
        scrollToTop,
        hasMultipleLinkToFragmentQuestions,
        optionsHavingConnectedQuestions,
        optionsHavingNoNextRoutes,
        questionsRequiringRefs,
        connectedQuestionsToShow,
        connectedQuestionsToRemove,
        previousAnswers,
        infoMessage,
        errorMessage,
        readOnly,
        fragment: { label, titles = [] } = {}
    } = props.renderData;
    const buttonsViewRef = useRef();
    const autoFocusRefsMap = useRef({});
    const animatedViewRefsMap = useRef({});
    const contentRef = useRef();
    let btnRef = useRef();
    const maxDate = new Date();

    useEffect(() => {
        if (titles.length) {
            if (hasMultipleLinkToFragmentQuestions) {
                props.setInfoMessage('fragment_multiple_links');
            }
            if (!showNextButton) {
                setShowNextButton(true);
                showButtonsView(buttonsViewRef);
            }
            if (next === 0) {
                setNextButtonLabel(I18n.t('finish'));
            } else if (optionsHavingNoNextRoutes) {
                const result = Object.keys(optionsHavingNoNextRoutes).some(key => {
                    if (previousAnswers.hasOwnProperty(key) && optionsHavingNoNextRoutes[key].includes(previousAnswers[key])) {
                        setNextButtonLabel(I18n.t('finish'));
                        return true;
                    }
                    return false;
                });
                if (!result) {
                    setNextButtonLabel(I18n.t('next'));
                }
            } else {
                setNextButtonLabel(I18n.t('next'));
            }
            if (scrollToTop) {
                contentRef.current.scrollToPosition(0, 0);
            }
        }
    }, [titles, scrollToTop]);

    useEffect(() => {
        function handleBackButton() {
            if (prev) {
                previousButton();
                return true;
            }
            return false;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            backHandler.remove();
        }
    }, [prev]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                hideButtonsView(buttonsViewRef, setKeyboardVisible);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                showButtonsView(buttonsViewRef);
            }
        );
        return () => {
            // Anything in here is fired on component unmount.
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
            props.resetSurvey();
        }
    }, []);

    useEffect(() => {
        if (connectedQuestionsToRemove) {
            const promises = [];
            connectedQuestionsToRemove.forEach(connectedQuestion => {
                if (animationData) {
                    promises.push(animatedViewRefsMap.current[connectedQuestion]?.fadeOutLeft(500));
                }else{
                    promises.push(animatedViewRefsMap.current[connectedQuestion]);
                }
            });
            Promise.all(promises).then(() => {
                clearConnectedQuestionsToShow();
                connectedQuestionsToRemove.forEach(connectedQuestion => {
                    delete animatedViewRefsMap.current[connectedQuestion];
                });
            });
        }
    }, [connectedQuestionsToRemove]);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (finish && appTourTargets.length === 1 && !appTour.qrScannerModal && !appTour.finishSurveyBtn && appTour.finishSurvey && isFocused && nextButtonLabel === I18n.t('finish') && !appTour.selectLocation) {
            setFinish(false);
            //qr finish
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);

        } else if (appTour.finishSurvey && appTour.finishSurveyBtn && !appTour.selectLocation && appTour.qrScannerModal && isFocused && nextButtonLabel === I18n.t('finish')) {
            //loc finish
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);
        }

    }, [isFocused, appTour, nextButtonLabel]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        content: {
            paddingHorizontal: convertWidth(13),
            paddingTop: convertHeight(30)
        },
        card: {
            alignSelf: 'stretch',
            marginBottom: convertHeight(30),
            paddingTop: convertHeight(30),
            paddingBottom: convertHeight(30)
        },
        titleText: {
            color: theme['text-black-color'],
            marginBottom: convertHeight(30)
        },
        buttonView: {
            height: convertHeight(60),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: convertWidth(13),
            marginTop: convertHeight(10)
        },
        button: {
            width: convertWidth(148),
            height: convertHeight(38)
        }
    });

    return (
        <SafeAreaView>
            <Header alignment='start' title={label} />
            <Content ref={contentRef} style={[styles.content, { opacity: readOnly ? 0.7 : 1 }]}>
                {
                    titles.map((title, i) => {
                        const { questions = [] } = title;
                        return <AnimatedCard useNativeDriver animation={animationData ? 'bounceInRight' : undefined} key={title.id} shadow readOnly={readOnly} style={styles.card}>
                            {
                                title.showLabel &&
                                <Text
                                    style={styles.titleText} category='h4'>{title.title}</Text>
                            }
                            {
                                questions.map((question, index) => (
                                    getElements({
                                        question,
                                        index,
                                        connectedQuestionsToShow,
                                        connectedQuestionsToRemove,
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        setFieldValue,
                                        setFieldTouched,
                                        optionsHavingNoNextRoutes,
                                        optionsHavingConnectedQuestions,
                                        questionsRequiringRefs,
                                        processConnectedQuestions,
                                        setNextButtonLabel,
                                        autoFocusRefsMap,
                                        animatedViewRefsMap,
                                        setDataSource,
                                        readOnly,
                                        theme,
                                        setScanQrCodeAppTour,
                                        locales,
                                        maxDate,
                                        animationData
                                    })
                                ))
                            }
                        </AnimatedCard>
                    })
                }
                {
                    <Modal visible={infoMessage}
                        message={I18n.t(infoMessage)}
                        onOk={props.clearMessages}
                    />
                }
                {
                    <Modal visible={errorMessage}
                        message={I18n.t(errorMessage)}
                        onOk={() => {
                            props.clearMessages();
                            props.navigateBack();
                        }}
                        okText={I18n.t('finish')}
                    />
                }
            </Content>
            <AnimatedView useNativeDriver ref={buttonsViewRef} style={[styles.buttonView, { height: isKeyboardVisible ? 0 : convertHeight(60) }]}>
                {
                    prev ?
                        <Button style={styles.button}
                            appearance='outline'
                            status='basic'
                            onPress={previousButton}
                            accessoryLeft={() => {
                                return (
                                    <Icon name="arrow-left" pack="material-community" style={{ height: convertHeight(25), color: theme['color-basic-600'] }} />
                                );
                            }}>
                            {I18n.t('previous')}
                        </Button> :
                        <View style={styles.button} />
                }
                {
                    <View
                        style={{
                            backgroundColor: '#fff', width: convertWidth(160),
                            height: convertHeight(50)
                        }}
                        ref={ref => {
                            if (!ref) return;
                            btnRef = ref;
                            let props = {
                                order: 1,
                                title: I18n.t('tap_here_to_finish_survey'),
                                outerCircleColor: theme['color-basic-1001'],
                                cancelable: true
                            };
                            if (!appTour.qrScannerModal && appTour.finishSurvey && !appTour.finishSurveyBtn && appTourTargets.length === 0) {
                                //qr finish
                                appTourTargets.push(AppTourView.for(btnRef, { ...props }));
                            } else if (appTour.finishSurvey && !appTour.selectLocation && appTour.finishSurveyBtn && appTour.qrScannerModal && appTourTargets.length === 0) {
                                //location finish
                                appTourTargets.push(AppTourView.for(btnRef, { ...props }));
                            }

                        }}>
                        {
                            showNextButton &&
                            <Button
                                style={styles.button}
                                status='basic'
                                onPress={() => {
                                    if (nextButtonLabel === I18n.t('finish')) {
                                        props.setFinishSurveyBtn();
                                    }
                                    if (dfgLock.acquired) {
                                        infoToast(I18n.t('please_wait'), 0);
                                        waitUntil(() => dfgLock.acquired).then(() => {
                                            handleSubmit();
                                            hideToast();
                                        });
                                    } else {
                                        handleSubmit();
                                    }
                                }}
                                accessoryRight={() => {
                                    return nextButtonLabel === I18n.t('finish') ? null :
                                        <Icon name="arrow-right" pack="material-community" style={{ height: convertHeight(25), color: theme['color-basic-100'] }} />
                                }}>
                                {nextButtonLabel}
                            </Button>
                        }
                    </View>
                }
            </AnimatedView>
        </SafeAreaView >
    );
};
