// import DateTimePicker, { AndroidNativeProps, IOSNativeProps, WindowsNativeProps } from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const MyDateTimePicker = (props: any) => {

  const { t, i18n } = useTranslation()

  console.log(i18n.language, 111)

  const maximumDate = dayjs(new Date()).add(180, 'day').toDate()
  const { onChange, setOpen } = props
  // return (<DateTimePicker minimumDate={props?.minimumDate ?? new Date()} maximumDate={props?.maximumDate ?? maximumDate}  {...props} />)
  /* locale zh en */
  return (<DatePicker
    modal
    theme='dark'
    minimumDate={props?.minimumDate ?? new Date()} maximumDate={props?.maximumDate ?? maximumDate}  {...props}
    onConfirm={(date) => {
      onChange(date)
    }}
    title={t('common.time')}
    confirmText={t('common.btn2')}
    cancelText={t('common.btn6')}
    locale={i18n.language}
    onCancel={() => {
      setOpen(false)
    }}
  />)
}

export default MyDateTimePicker
