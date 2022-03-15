import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import RNConfigReader from 'rn-config-reader';
import { useTheme } from '@ui-kitten/components';
import { components, utils, I18n } from '../../../common';

const { Header, Text, Card, Icon, Input, Dropdown, Picker, Button } = components;
const { Item } = Picker;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const PhoneSupportView = (props) => {
    const { dropDownData } = props;
    const theme = useTheme();
    const [detpartmentFeedBack, setDetpartmentFeedBack] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const styles = StyleSheet.create({
        iconBg: {
            height: convertHeight(25),
            width: convertWidth(25),
            borderRadius: convertHeight(25),
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    const phoneToCall = (phone) => {
        const phoneNumber = dropDownData.support_contact;
        if (phoneNumber) {
            Linking.canOpenURL(`tel:${phoneNumber}`).then(supported => {
                return Linking.openURL(`tel:${phoneNumber}`);
            });
        }
    };

    useEffect(() => {
        props.fetchDepartment({ 'type': 'phoneSupport' });
    }, []);

    return (
        <>
            <Header title={I18n.t('phone_support')} />
            <View style={{ margin: convertHeight(15) }}>
                <Text category='h5' style={{ fontWeight: 'bold' }}>{I18n.t('like_to_call')}</Text>
                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <TouchableOpacity disabled={dropDownData.support_contact ? false : true}
                        activeOpacity={0.9} onPress={() => phoneToCall()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <View style={[styles.iconBg, { backgroundColor: theme['color-success-100'] }]}>
                            <Icon name="cellphone" pack="material-community" style={{ height: convertHeight(14), color: theme['color-success-500'] }} />
                        </View>
                        <View style={{ paddingLeft: convertWidth(10) }}>
                            <Text category='h5'>{I18n.t(RNConfigReader.app_name_key)} {I18n.t('support_team')}</Text>
                            <Text style={{ color: theme['text-disabled-color'] }} category='h5'>{I18n.t('contact')} {I18n.t(RNConfigReader.app_name_key)} {I18n.t('support_team')}</Text>
                        </View>
                    </TouchableOpacity>
                </Card>

                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => setDetpartmentFeedBack(!detpartmentFeedBack)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <View style={[styles.iconBg, { backgroundColor: theme['color-info-100'] }]}>
                            <Icon name="domain" pack="material-community" style={{ height: convertHeight(14), color: theme['color-info-500'] }} />
                        </View>
                        <View style={{ paddingLeft: convertWidth(10) }}>
                            <Text category='h5'>{I18n.t('department')} {I18n.t('support_team')}</Text>
                            <Text style={{ color: theme['text-disabled-color'], width: convertWidth(280) }} category='h5'>{I18n.t('contact_dept_service_offered')}</Text>
                        </View>
                    </TouchableOpacity>
                    {detpartmentFeedBack && <View style={{ marginBottom: convertHeight(7) }}>
                        <Dropdown
                            picker={
                                <Picker
                                    key={selectedDepartment}
                                    selectedValue={selectedDepartment}
                                    onValueChange={(itemValue) => {
                                        setSelectedDepartment(itemValue);
                                    }}
                                    numberOfLines={2}
                                    mode="dropdown">
                                    {
                                        [
                                            <Picker.Item key={0} label={I18n.t('choose_department')} value="select" />,
                                            ...dropDownData.dropDownData?.map(option => <Item key={option.id} label={option.label} value={option.id} />)
                                        ]
                                    }
                                </Picker>
                            }
                        />
                        <Button
                            appearance='filled'
                            size='large'
                            status="primary"
                            style={{
                                backgroundColor: theme['color-basic-600'],
                                borderWidth: 0,
                                marginTop: convertHeight(7)
                            }}
                            onPress={() => setDetpartmentFeedBack(!detpartmentFeedBack)}
                        >
                            <Text appearance='alternative' category='h5'>{I18n.t('contact')} {I18n.t('department')}</Text>
                        </Button>
                    </View>}
                </Card>
            </View>
        </>
    )
}

export default PhoneSupportView;