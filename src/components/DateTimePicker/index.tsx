// import DateTimePicker, { AndroidNativeProps, IOSNativeProps, WindowsNativeProps } from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'

const MyDateTimePicker = (props: any) => {

  const maximumDate = dayjs(new Date()).add(180, 'day').toDate()
  const { onChange, setOpen } = props
  // return (<DateTimePicker minimumDate={props?.minimumDate ?? new Date()} maximumDate={props?.maximumDate ?? maximumDate}  {...props} />)

  return (<DatePicker
    modal
    theme='dark'
    minimumDate={props?.minimumDate ?? new Date()} maximumDate={props?.maximumDate ?? maximumDate}  {...props}
    onConfirm={(date) => {
      onChange(date)
    }}
    onCancel={() => {
      setOpen(false)
    }}
  />)
}

export default MyDateTimePicker
