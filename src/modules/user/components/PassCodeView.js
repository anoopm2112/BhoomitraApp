import React, { useEffect, useState } from 'react';
import { BackHandler, TouchableOpacity, View, StyleSheet } from 'react-native';
import PINCode from '@haskkor/react-native-pincode';
import * as Keychain from 'react-native-keychain';
import { useTheme } from '@ui-kitten/components';
import { components, I18n, utils } from '../../../common';

const { SafeAreaView, Text } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

export default PassCodeView = (props) => {

    const { data: { status, resetPassCode } } = props.route.params;
    const { prepareEncryptionKey, forgotPassCode } = props;
    const theme = useTheme();
    const [oldPassCode, setOldPassCode] = useState(undefined);

    const styles = StyleSheet.create({
        passwordButton: {
            height: convertHeight(30),
            width: convertHeight(30),
            borderRadius: convertHeight(30),
            borderColor: theme['color-basic-500'],
            borderWidth: 1
        },
        forgotBtn: {
            color: theme['color-basic-500'],
            fontWeight: 'bold'
        }
    });

    useEffect(() => {
        if (resetPassCode) {
            Keychain.getInternetCredentials('reactNativePinCode').then((credentials) => {
                setOldPassCode(credentials.password);
            });
        }
    }, [resetPassCode]);

    return (
        <SafeAreaView>
            <PINCode
                status={status}
                disableLockScreen={true}
                touchIDDisabled={true}
                finishProcess={(pinCode) => {
                    prepareEncryptionKey({ status, pinCode, oldPassCode });
                }}
                onClickButtonLockedPage={() => BackHandler.exitApp()}
                colorCircleButtons={theme['color-basic-100']}
                colorPassword={theme['color-basic-500']}
                colorPasswordEmpty={theme['color-basic-100']}
                colorPasswordError={theme['color-danger-600']}
                styleMainContainer={{ backgroundColor: theme['color-basic-100'] }}
                stylePinCodeColorTitle={theme['text-black-color']}
                stylePinCodeColorTitleError={theme['color-danger-600']}
                stylePinCodeColorSubtitle={theme['color-basic-100']}
                stylePinCodeColorSubtitleError={theme['color-danger-600']}
                stylePinCodeButtonNumber={theme['text-black-color']}
                numbersButtonOverlayColor={theme['text-hint-color']}
                titleChoose={I18n.t('title_choose')}
                titleConfirm={I18n.t('title_confirm')}
                subtitleError={I18n.t('subtitle_error')}
                titleAttemptFailed={I18n.t('title_attempt_failed')}
                titleConfirmFailed={I18n.t('title_confirm_failed')}
                titleEnter={I18n.t('title_enter')}
                buttonDeleteText={I18n.t('button_delete_text')}
                stylePinCodeDeleteButtonColorHideUnderlay={theme['color-danger-600']}
                stylePinCodeDeleteButtonColorShowUnderlay={theme['color-basic-100']}
                stylePinCodeButtonNumberPressed={theme['color-basic-100']}
                stylePinCodeTextTitle={{ fontSize: convertHeight(20) }}
                textPasswordVisibleSize={convertHeight(22)}
                stylePinCodeTextTitle={{ fontWeight: 'bold' }}
                pinCodeVisible={status === 'enter' ? false : true}
                stylePinCodeCircle={styles.passwordButton}
                stylePinCodeTextTitle={{ fontSize: convertHeight(18) }}
            />
            {status === 'enter' &&
                <View style={{ height: convertHeight(55), alignItems: 'center' }}>
                    <TouchableOpacity onPress={forgotPassCode}>
                        <Text style={styles.forgotBtn}>{I18n.t('forgotPin')}</Text>
                    </TouchableOpacity>
                </View>}
        </SafeAreaView>
    );

}
