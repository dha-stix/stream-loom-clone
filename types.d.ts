type CallWithRecordings = {
    call: Call;
    recordings: CallRecording[];
};
type CommentArgs = {
    comment: string;
    userName: string;
    recordID: string;
    createdAt?: string;
}