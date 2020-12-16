export class CurrentTimeService{
    public getCurrentDate(): string {
        let today = new Date();
        let date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + ' ' + time;
      }
}