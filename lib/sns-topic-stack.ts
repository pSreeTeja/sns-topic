import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SnsTopicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this,'myTopic',{
      topicName: 'MyFirstTopic',
    });
    const sqsQueueArn = "arn:aws:sqs:ap-south-1:685181039857:events-subscription-sqs"
    const sqsQueue = sqs.Queue.fromQueueArn(this, 'ImportedQueue',sqsQueueArn);
    const crossAccountSubcription = new subscriptions.SqsSubscription(sqsQueue,{
      filterPolicy:{
        messageType: sns.SubscriptionFilter.stringFilter({
          allowlist: ['MOVIES'],
        })
      }
    })
    topic.addSubscription(crossAccountSubcription);
  }
}
