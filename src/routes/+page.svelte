
<script lang="ts">
  import { onMount } from 'svelte';

  import type { Notification } from '../types/index';
  import { NotificationFacade } from '../notification-providers/NotificationFacade';
  import { DonatePayProvider } from '../notification-providers/DonatePay/index';
  import AlertMessage from '../components/AlertMessage.svelte';

  const providerMap = {
    donatePay: DonatePayProvider
  }

  const messageQueue: Notification[] = [];
  let alert: Notification | null = null;

  function handleNotification(notification: Notification) {
    console.log(notification);

    if (!alert) {
      // Если нет текущего оповещения, сразу показываем
      alert = notification;
      setTimeout(() => {
        // После завершения проверяем очередь
        if (messageQueue.length > 0) {
          alert = null;
          // Через секунду берем следующее из очереди
          setTimeout(() => {
            alert = messageQueue.shift()!;
            console.log(alert);
            handleNotification(alert);
          }, 1000);
        } else {
          alert = null;
        }
      }, notification.duration * 1000);
    } else {
      // Если уже есть активное оповещение, добавляем в очередь
      messageQueue.push(notification);
    }
  }

  onMount(() => {
    const notificationFacade = NotificationFacade.getInstance();
    notificationFacade.subscribe((value) => console.log(value));

    const url = new URL('https://example.com/api/notifications?donatePay=$public:1297436|gLd6RJ84xv8ojtajb5XTLo9pF8s35DfuLXkbE27xsGIGUryOWb4ztGW0Ae5g|72a4f6e488a4b11b8e2feafcd918a10ebb31b18c94d1de01be3f41f8c22edf31');

    url.searchParams.forEach((value, key) => {
      const provider = providerMap[key as keyof typeof providerMap];
      const [channel, accessToken, widgetIdsStr] = value.split('|');
      const widgetIds = widgetIdsStr.split(',');
      notificationFacade.addProvider(
      key,
      new provider(
        channel,
        accessToken,
        widgetIds,
        handleNotification
      )
    );
  });

    // Одна строка для подключения всех провайдеров
    notificationFacade.connectAll();

    return () => {
      notificationFacade.disconnectAll();
    }
  });


</script>

<div>hello</div>
{#if alert}
  <AlertMessage alert={{...alert, type: 'donation'}} />
{/if}