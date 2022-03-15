import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { components, utils, I18n } from '../../../common';
import RNConfigReader from 'rn-config-reader';

const { Header, Text, Card, Icon, Input, Dropdown, Picker, Button } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { Item } = Picker;

const SendFeedBackView = (props) => {
    const { dropDownData } = props;
    const theme = useTheme();
    const [appFeedBack, setAppFeedBack] = useState(false);
    const [detpartmentFeedBack, setDetpartmentFeedBack] = useState(false);
    const [otherFeedBack, setOtherFeedBack] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const styles = StyleSheet.create({
        iconBg: {
            height: convertHeight(25),
            width: convertWidth(25),
            borderRadius: convertHeight(25),
            justifyContent: 'center',
            alignItems: 'center'
        },
        cardBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: convertHeight(15)
        }
    });

    useEffect(() => {
        props.fetchDepartment({ 'type': 'sendFeedback' });
    }, []);

    return (
        <>
            <Header title={I18n.t('send_feedback_support')} />
            <View style={{ margin: convertHeight(15) }}>
                <Text category='h5' style={{ fontWeight: 'bold' }}>{I18n.t('choose_category')}</Text>
                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => {
                        setAppFeedBack(!appFeedBack)
                        setDetpartmentFeedBack(false)
                        setOtherFeedBack(false)
                    }} style={styles.cardBtn}>
                        <View style={[styles.iconBg, { backgroundColor: theme['color-success-100'] }]}>
                            <Icon name="cellphone" pack="material-community" style={{ height: convertHeight(14), color: theme['color-success-500'] }} />
                        </View>
                        <Text style={{ paddingLeft: convertWidth(7), width: convertWidth(280) }} category='h5'>{I18n.t('send_feedback_about')} {I18n.t(RNConfigReader.app_name_key)}</Text>
                    </TouchableOpacity>
                    {appFeedBack && <View style={{ marginBottom: convertHeight(7) }}>
                        <Input
                            label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                            size='large'
                            status={'basic'}
                            multiline={true} />
                        <Button
                            appearance='filled'
                            size='large'
                            status="primary"
                            style={{ backgroundColor: theme['color-basic-600'], borderWidth: 0, marginTop: convertHeight(7) }}
                            onPress={() => setAppFeedBack(!appFeedBack)}>
                            <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                        </Button>
                    </View>}
                </Card>
                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => {
                        setDetpartmentFeedBack(!detpartmentFeedBack)
                        setAppFeedBack(false)
                        setOtherFeedBack(false)
                    }} style={styles.cardBtn}>
                        <View style={[styles.iconBg, { backgroundColor: theme['color-info-100'] }]}>
                            <Icon name="domain" pack="material-community" style={{ height: convertHeight(14), color: theme['color-info-500'] }} />
                        </View>
                        <Text style={{ paddingLeft: convertWidth(7) }} category='h5'>{I18n.t('send_feedback_about_dept_service')}</Text>
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
                                            ...dropDownData?.map(option => <Item key={option.id} label={option.label} value={option.id} />)
                                        ]
                                    }
                                </Picker>
                            }
                        />
                        <Input
                            label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                            size='large'
                            status={'basic'}
                            multiline={true} />
                        <Button
                            appearance='filled'
                            size='large'
                            status="primary"
                            style={{ backgroundColor: theme['color-basic-600'], borderWidth: 0, marginTop: convertHeight(7) }}
                            onPress={() => setDetpartmentFeedBack(!detpartmentFeedBack)} >
                            <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                        </Button>
                    </View>}
                </Card>

                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => {
                        setOtherFeedBack(!otherFeedBack)
                        setDetpartmentFeedBack(false)
                        setAppFeedBack(false)
                    }} style={styles.cardBtn}>
                        <View style={[styles.iconBg, { backgroundColor: theme['color-warning-100'] }]}>
                            <Icon name="dots-horizontal-circle" pack="material-community" style={{ height: convertHeight(14), color: theme['color-warning-500'] }} />
                        </View>
                        <Text style={{ paddingLeft: convertWidth(7) }} category='h5'>{I18n.t('other')}</Text>
                    </TouchableOpacity>
                    {otherFeedBack && <View animation="fadeInLeft" style={{ marginBottom: convertHeight(7) }}>
                        <Input
                            label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                            size='large'
                            status={'basic'}
                            multiline={true} />
                        <Button
                            appearance='filled'
                            size='large'
                            status="primary"
                            style={{ backgroundColor: theme['color-basic-600'], borderWidth: 0, marginTop: convertHeight(7) }}
                            onPress={() => setOtherFeedBack(!otherFeedBack)} >
                            <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                        </Button>
                    </View>}
                </Card>
            </View>
        </>
    )
}

export default SendFeedBackView;